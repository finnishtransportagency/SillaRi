package fi.vaylavirasto.sillari.service;


import fi.vaylavirasto.sillari.api.lelu.permit.LeluDTOMapper;
import fi.vaylavirasto.sillari.api.lelu.permit.LeluPermitDTO;
import fi.vaylavirasto.sillari.api.lelu.permit.LeluPermitResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.permit.LeluPermitStatus;
import fi.vaylavirasto.sillari.api.lelu.permitPdf.LeluPermiPdfResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.routeGeometry.LeluRouteGeometryResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.supervision.LeluBridgeSupervisionResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.supervision.LeluRouteResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.supervision.LeluSupervisionStatus;
import fi.vaylavirasto.sillari.api.rest.error.*;
import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.repositories.*;
import fi.vaylavirasto.sillari.service.trex.TRexService;
import fi.vaylavirasto.sillari.util.LeluRouteUploadUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LeluService {
    private static final Logger logger = LogManager.getLogger();
    private final LeluDTOMapper dtoMapper = Mappers.getMapper(LeluDTOMapper.class);

    private PermitRepository permitRepository;
    private CompanyRepository companyRepository;
    private RouteRepository routeRepository;
    private RouteBridgeRepository routeBridgeRepository;
    private BridgeRepository bridgeRepository;
    private SupervisionRepository supervisionRepository;
    private SupervisionStatusRepository supervisionStatusRepository;
    private SupervisionReportRepository supervisionReportRepository;
    private SupervisionService supervisionService;
    private final MessageSource messageSource;
    private LeluRouteUploadUtil leluRouteUploadUtil;
    private AWSS3Client awss3Client;
    private final TRexService trexService;

    @Value("${spring.profiles.active:Unknown}")
    private String activeProfile;

    @Autowired
    public LeluService(PermitRepository permitRepository, CompanyRepository companyRepository, RouteRepository routeRepository, RouteBridgeRepository routeBridgeRepository, BridgeRepository bridgeRepository, SupervisionRepository supervisionRepository, SupervisionStatusRepository supervisionStatusRepository, SupervisionReportRepository supervisionReportRepository, MessageSource messageSource, LeluRouteUploadUtil leluRouteUploadUtil, AWSS3Client awss3Client,
                       TRexService trexService, SupervisionService supervisionService) {
        this.permitRepository = permitRepository;
        this.companyRepository = companyRepository;
        this.routeRepository = routeRepository;
        this.routeBridgeRepository = routeBridgeRepository;
        this.bridgeRepository = bridgeRepository;
        this.messageSource = messageSource;
        this.leluRouteUploadUtil = leluRouteUploadUtil;
        this.supervisionRepository = supervisionRepository;
        this.supervisionStatusRepository = supervisionStatusRepository;
        this.supervisionReportRepository = supervisionReportRepository;
        this.supervisionService = supervisionService;
        this.awss3Client = awss3Client;
        this.trexService = trexService;
    }

    // TODO
    //this used currently to ease lelu testing.
    //Deletes everything under the permit with lelu permit id if given.
    //Will be replaced by createOrUpdatePermit eventually.
    public LeluPermitResponseDTO createOrUpdatePermitDevVersion(LeluPermitDTO permitDTO) throws LeluDeleteRouteWithSupervisionsException {
        LeluPermitResponseDTO response = new LeluPermitResponseDTO(permitDTO.getNumber(), LocalDateTime.now(ZoneId.of("Europe/Helsinki")));

        logger.trace("Map permit from: " + permitDTO);
        PermitModel permitModel = dtoMapper.fromDTOToModel(permitDTO);
        logger.trace("Permit mapped from LeLu model: {}", permitModel);

        // Fetch company from DB with business ID. If not found, insert new company.
        Integer companyId = getCompanyIdByBusinessId(permitModel.getCompany());
        permitModel.setCompanyId(companyId);

        // Find bridges with OID from DB and set corresponding bridgeIds to routeBridges
        produceBridgeDataForRouteBridges(permitModel.getRoutes());
        PermitModel oldPermitModel = getWholePermitModel(permitModel.getPermitNumber());

        if (oldPermitModel != null) {
            logger.debug("Permit with id {} found, delete and create new", oldPermitModel);


            deletePermit(oldPermitModel);

            Integer permitModelId = permitRepository.createPermit(permitModel);

            response.setPermitId(permitModelId);
            response.setStatus(LeluPermitStatus.CREATED);
            return response;
        } else {
            logger.debug("Permit not found with id {}, create new", permitModel.getPermitNumber());

            // Insert new permit and all child records
            // Missing route addresses (not yet in lelu model)
            Integer permitModelId = permitRepository.createPermit(permitModel);

            response.setPermitId(permitModelId);
            response.setStatus(LeluPermitStatus.CREATED);
            return response;
        }
    }

    private PermitModel getWholePermitModel(String permitNumber) {
        PermitModel oldPermitModel = permitRepository.getPermitByPermitNumber(permitNumber);
        if (oldPermitModel != null) {
            List<RouteModel> routes = routeRepository.getRoutesByPermitId(oldPermitModel.getId());
            oldPermitModel.setRoutes(routes);

            if (routes != null) {
                for (RouteModel route : oldPermitModel.getRoutes()) {
                    List<RouteBridgeModel> routeBridges = routeBridgeRepository.getRouteBridges(route.getId());
                    route.setRouteBridges(routeBridges);

                    if (routeBridges != null) {
                        for (RouteBridgeModel routeBridge : route.getRouteBridges()) {
                            routeBridge.setSupervisions(supervisionRepository.getSupervisionsByRouteBridgeId(routeBridge.getId()));
                        }
                    }
                }
            }
        }
        return oldPermitModel;
    }


    //TODO Will eplace createOrUpdatePermitDevVersion eventually.
    public LeluPermitResponseDTO createOrUpdatePermit(LeluPermitDTO permitDTO) throws LeluDeleteRouteWithSupervisionsException {
        LeluPermitResponseDTO response = new LeluPermitResponseDTO(permitDTO.getNumber(), LocalDateTime.now(ZoneId.of("Europe/Helsinki")));

        logger.debug("Map permit from: " + permitDTO);
        PermitModel permitModel = dtoMapper.fromDTOToModel(permitDTO);
        logger.debug("Permit mapped from LeLu model: {}", permitModel);

        // Fetch company from DB with business ID. If not found, insert new company.
        Integer companyId = getCompanyIdByBusinessId(permitModel.getCompany());
        permitModel.setCompanyId(companyId);

        // Find bridges with OID from DB and set corresponding bridgeIds to routeBridges
        produceBridgeDataForRouteBridges(permitModel.getRoutes());

        Integer permitId = permitRepository.getPermitIdByPermitNumberAndVersion(permitModel.getPermitNumber(), permitModel.getLeluVersion());

        if (permitId != null) {
            logger.debug("Permit with id {} found, update", permitId);

            permitModel.setId(permitId);
            updatePermit(permitModel);

            response.setPermitId(permitId);
            response.setStatus(LeluPermitStatus.UPDATED);
            return response;
        } else {
            logger.debug("Permit not found with id {}, create new", permitId);

            // Insert new permit and all child records
            // Missing route addresses (not yet in lelu model)
            Integer permitModelId = permitRepository.createPermit(permitModel);

            response.setPermitId(permitModelId);
            response.setStatus(LeluPermitStatus.CREATED);
            return response;
        }
    }

    public LeluRouteGeometryResponseDTO uploadRouteGeometry(Long routeId, MultipartFile file) throws LeluRouteNotFoundException, LeluRouteGeometryUploadException {
        logger.debug("uploadRouteGeometry: " + routeId + " " + file.getName());
        List<RouteModel> routes = routeRepository.getRoutesWithLeluId(routeId);

        if (routes == null || routes.isEmpty()) {
            logger.warn("Route not found with lelu id " + routeId);
            throw new LeluRouteNotFoundException(messageSource.getMessage("lelu.route.not.found", null, Locale.ROOT));
        }

        ResponseEntity<?> responseEntity = leluRouteUploadUtil.doRouteGeometryUpload(routeId, file);

        if (!HttpStatus.OK.equals(responseEntity.getStatusCode())) {
            String responseMessage = responseEntity.getBody() != null ? responseEntity.getBody().toString() : responseEntity.getStatusCode().getReasonPhrase();
            throw new LeluRouteGeometryUploadException(responseMessage, responseEntity.getStatusCode());
        }

        return new LeluRouteGeometryResponseDTO(routeId, messageSource.getMessage("lelu.route.geometry.upload.completed", null, Locale.ROOT));

    }


    private Integer getCompanyIdByBusinessId(CompanyModel companyModel) {
        Integer companyId = companyRepository.getCompanyIdByBusinessId(companyModel.getBusinessId());
        if (companyId == null) {
            logger.debug("Create new company with business ID {}", companyModel.getBusinessId());
            companyId = companyRepository.createCompany(companyModel);
        }
        return companyId;
    }


    private void produceBridgeDataForRouteBridges(List<RouteModel> routes) {
        // Get bridge IDs for unique bridges in routes
        // What to do if bridge is not found?
        // we get it from trex,
        // but it might not be there if its Lelu by hand added so
        // TODO then we create bridge with LeLu data..
        Map<String, Integer> idOIDMap = getBridgeIdsWithOIDs(routes);
        for (RouteModel route : routes) {
            for (RouteBridgeModel routeBridge : route.getRouteBridges()) {
                String oid = routeBridge.getBridge().getOid();
                Integer bridgeId = idOIDMap.get(oid);
                if (bridgeId != null) {
                    routeBridge.setBridgeId(bridgeId);
                } else {
                    routeBridge.setBridgeId(addTrexBridgeToDB(routeBridge, oid));
                }
            }
        }
    }

    private Integer addTrexBridgeToDB(RouteBridgeModel routeBridge, String oid) {

        logger.debug("Bridge missing with oid {} get from trex", routeBridge.getBridge().getOid());
        try {
            BridgeModel newBridge = trexService.getBridge(oid);
            Integer newBridgeId = bridgeRepository.createBridge(newBridge);
            return newBridgeId;
        } catch (TRexRestException e) {
            //TODO if its Lelu by hand added so create bridge with LeLu data..?
            logger.warn("Bridge missing with oid {} not found in trex", routeBridge.getBridge().getOid());
            return null;
        }
    }

    private Map<String, Integer> getBridgeIdsWithOIDs(List<RouteModel> routes) {
        List<String> allOIDs = new ArrayList<>();
        for (RouteModel routeModel : routes) {
            allOIDs.addAll(routeModel.getRouteBridges().stream()
                    .map(routeBridge -> routeBridge.getBridge().getOid())
                    .collect(Collectors.toList()));
        }
        // Filter duplicates
        List<String> uniqueOIDs = new ArrayList<>(new HashSet<>(allOIDs));
        return bridgeRepository.getBridgeIdsWithOIDs(uniqueOIDs);
    }


    private void deletePermit(PermitModel permitModel) {
        permitRepository.deletePermit(permitModel);
    }

    private void updatePermit(PermitModel permitModel) throws LeluDeleteRouteWithSupervisionsException {
        // Check if old routes are all included in permit, routes not included anymore should be deleted
        // Routes with same lelu ID should be updated and not inserted as new, set existing sillari ID to those route models
        Map<Long, Integer> oldRouteIdLeluIdMap = routeRepository.getRouteIdsWithLeluIds(permitModel.getId());
        List<Long> newLeluIds = permitModel.getRoutes().stream().map(RouteModel::getLeluId).collect(Collectors.toList());

        List<Integer> routeIdsToRemove = new ArrayList<>();

        for (Long oldLeluId : oldRouteIdLeluIdMap.keySet()) {
            if (!newLeluIds.contains(oldLeluId)) {
                routeIdsToRemove.add(oldRouteIdLeluIdMap.get(oldLeluId));
            }
        }

        for (RouteModel newRoute : permitModel.getRoutes()) {
            if (oldRouteIdLeluIdMap.containsKey(newRoute.getLeluId())) {
                newRoute.setId(oldRouteIdLeluIdMap.get(newRoute.getLeluId()));
            }
        }

        //check if there exists supervisions for permits's routes, then update is not allowed, need to create a new version
        if (permitRepository.hasSupervisions(routeIdsToRemove)) {
            throw new LeluDeleteRouteWithSupervisionsException((messageSource.getMessage("lelu.route.has.supervisions", null, Locale.ROOT)));
        } else {
            permitRepository.updatePermit(permitModel, routeIdsToRemove);
        }
    }

    public LeluPermiPdfResponseDTO uploadPermitPdf(String permitNumber, Integer permitVersion, MultipartFile file) throws LeluPdfUploadException {
        Integer permitId = permitRepository.getPermitIdByPermitNumberAndVersion(permitNumber, permitVersion);
        if (permitId == null) {
            throw new LeluPdfUploadException(messageSource.getMessage("lelu.permit.not.found", null, Locale.ROOT), HttpStatus.NOT_FOUND);
        }
        String objectKey = "permitPdf/" + permitNumber + "_" + permitVersion + "/" + file.getOriginalFilename();


        if (activeProfile.equals("local")) {
            // Save to local file system
            File outputFile = new File("/", file.getOriginalFilename());
            try {
                Files.write(outputFile.toPath(), file.getBytes());
            } catch (IOException e) {
                logger.error("Error writing file." + e.getClass().getName() + " " + e.getMessage());
                throw new LeluPdfUploadException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            // Upload to AWS
            try {
                boolean success = awss3Client.upload(objectKey, file.getBytes(), "application/pdf", awss3Client.getPermitBucketName(), AWSS3Client.SILLARI_PERMITS_ROLE_SESSION_NAME);
                if (!success) {
                    throw new LeluPdfUploadException("Error uploading file to aws.", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            } catch (IOException e) {
                logger.error("Error uploading file to aws." + e.getClass().getName() + " " + e.getMessage());
                throw new LeluPdfUploadException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        permitRepository.updatePermitPdf(permitId, objectKey);

        return new LeluPermiPdfResponseDTO(permitNumber, permitVersion, messageSource.getMessage("lelu.permit.pdf.upload.completed", null, Locale.ROOT));

    }

    public LeluRouteResponseDTO getWholeRoute(Long leluRouteId) {
        RouteModel route = routeRepository.getRouteWithLeluID(leluRouteId);
        if (route != null) {

            List<RouteBridgeModel> routeBridges = routeBridgeRepository.getRouteBridges(route.getId());
            route.setRouteBridges(routeBridges);

            if (routeBridges != null) {
                for (RouteBridgeModel routeBridge : route.getRouteBridges()) {
                    List<SupervisionModel> supervisions = supervisionRepository.getSupervisionsByRouteBridgeId(routeBridge.getId());
                    routeBridge.setSupervisions(new ArrayList<>());
                    if (supervisions != null) {
                        supervisions.forEach(supervision -> {
                            var filledSupervision = supervisionService.getSupervision(supervision.getId(), true, false);
                            routeBridge.getSupervisions().add(filledSupervision);
                        });
                    }
                }
            }
        }
        logger.debug("HELLO!: " + route);
        return dtoMapper.fromModelToDTO(route);
    }

    public LeluBridgeSupervisionResponseDTO getSupervision(Long leluRouteId, String bridgeIdentifier, Integer transportNumber) throws LeluRouteNotFoundException {
        RouteModel route = routeRepository.getRouteWithLeluID(leluRouteId);
        if (route != null) {
            logger.debug("getting routebridge: " + route.getId() + " " + bridgeIdentifier + " " + transportNumber);
            RouteBridgeModel routeBridge = routeBridgeRepository.getRouteBridge(route.getId(), bridgeIdentifier, transportNumber);
            if (routeBridge != null) {
                List<SupervisionModel> supervisions = supervisionRepository.getSupervisionsByRouteBridgeId(routeBridge.getId());
                routeBridge.setSupervisions(new ArrayList<>());
                if (supervisions != null) {
                    supervisions.forEach(supervision -> {
                        var filledSupervision = supervisionService.getSupervision(supervision.getId(), true, false);
                        routeBridge.getSupervisions().add(filledSupervision);
                    });
                }
                logger.debug("HELLO!: " + routeBridge);
                try {
                    LeluBridgeSupervisionResponseDTO bridgeSupervisionResponseDTO = dtoMapper.fromModelToDTO2(routeBridge.getSupervisions().get(0));
                    bridgeSupervisionResponseDTO.setTransportNumber(routeBridge.getTransportNumber());
                    return bridgeSupervisionResponseDTO;
                } catch (IndexOutOfBoundsException e) {
                    //route bridge has no supervisions because none planned yet.
                    LeluBridgeSupervisionResponseDTO bridgeSupervisionResponseDTO = new LeluBridgeSupervisionResponseDTO();
                    bridgeSupervisionResponseDTO.setTransportNumber(routeBridge.getTransportNumber());
                    LeluSupervisionStatus superVisionStatus = new LeluSupervisionStatus();
                    superVisionStatus.setStatus(SupervisionStatusType.RECEIVED_FROM_LELU);
                    superVisionStatus.setModifiedDate(routeBridge.getRowCreatedTime());
                    bridgeSupervisionResponseDTO.setSupervisionStatus(superVisionStatus);
                    return bridgeSupervisionResponseDTO;

                }
            } else {
                throw new LeluRouteNotFoundException("Route bridge not found " + leluRouteId + " " + bridgeIdentifier + " " + transportNumber);
            }
        } else {
            throw new LeluRouteNotFoundException("Route not found " + leluRouteId);
        }

    }

}
