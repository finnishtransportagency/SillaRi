package fi.vaylavirasto.sillari.service;


import fi.vaylavirasto.sillari.api.lelu.permit.LeluDTOMapper;
import fi.vaylavirasto.sillari.api.lelu.permit.LeluPermitDTO;
import fi.vaylavirasto.sillari.api.lelu.permit.LeluPermitResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.permit.LeluPermitStatus;
import fi.vaylavirasto.sillari.api.lelu.permitPdf.LeluPermiPdfResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.routeGeometry.LeluRouteGeometryResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.supervision.LeluBridgeSupervisionResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.supervision.LeluSupervisionStatus;
import fi.vaylavirasto.sillari.api.rest.error.*;
import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.repositories.*;
import fi.vaylavirasto.sillari.service.trex.TRexBridgeInfoService;
import fi.vaylavirasto.sillari.service.trex.TRexPicService;
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
    private SupervisionService supervisionService;
    private MessageSource messageSource;
    private LeluRouteUploadUtil leluRouteUploadUtil;
    private AWSS3Client awss3Client;
    private TRexBridgeInfoService trexBridgeInfoService;
    private TRexPicService tRexPicService;


    @Value("${spring.profiles.active:Unknown}")
    private String activeProfile;

    @Autowired
    public LeluService(PermitRepository permitRepository, CompanyRepository companyRepository, RouteRepository routeRepository, RouteBridgeRepository routeBridgeRepository, BridgeRepository bridgeRepository, SupervisionRepository supervisionRepository, MessageSource messageSource, LeluRouteUploadUtil leluRouteUploadUtil, AWSS3Client awss3Client,
                       TRexBridgeInfoService trexBridgeInfoService, TRexPicService tRexPicService, SupervisionService supervisionService) {
        this.permitRepository = permitRepository;
        this.companyRepository = companyRepository;
        this.routeRepository = routeRepository;
        this.routeBridgeRepository = routeBridgeRepository;
        this.bridgeRepository = bridgeRepository;
        this.messageSource = messageSource;
        this.leluRouteUploadUtil = leluRouteUploadUtil;
        this.supervisionRepository = supervisionRepository;
        this.supervisionService = supervisionService;
        this.awss3Client = awss3Client;
        this.trexBridgeInfoService = trexBridgeInfoService;
        this.tRexPicService = tRexPicService;
    }

    public LeluPermitResponseDTO createPermit(LeluPermitDTO permitDTO) throws LeluPermitSaveException {
        LeluPermitResponseDTO response = new LeluPermitResponseDTO(permitDTO.getNumber(), LocalDateTime.now(ZoneId.of("Europe/Helsinki")));

        logger.debug("Map permit from: " + permitDTO);
        PermitModel permitModel = dtoMapper.fromDTOToModel(permitDTO);
        logger.debug("Permit mapped from LeLu model: {}", permitModel);

        // Check if permits already exist with the same permit number
        handlePreviousPermitVersions(permitModel, response);

        // Fetch company from DB with business ID. If not found, insert new company.
        Integer companyId = getOrCreateCompany(permitModel.getCompany());
        permitModel.setCompanyId(companyId);

        // Find bridges with OID from DB and set corresponding bridgeIds to routeBridges
        produceBridgeDataForRouteBridges(permitModel.getRoutes());

        // Insert new permit and all child records
        Integer permitModelId = permitRepository.createPermit(permitModel);

        response.setPermitId(permitModelId);
        return response;
    }

    private void handlePreviousPermitVersions(PermitModel permitModel, LeluPermitResponseDTO response) throws LeluPermitSaveException {
        // Check if we already have permits with the same permit number
        // If we have previous versions, create new permit version and mark old ones as not current.
        List<PermitModel> oldPermits = permitRepository.getPermitsByPermitNumber(permitModel.getPermitNumber());
        if (oldPermits != null && !oldPermits.isEmpty()) {
            logger.debug("{} permits with same permitNumber {} found", oldPermits.size(), permitModel.getPermitNumber());
            // Check if same leluVersion exists
            List<PermitModel> permitsWithSameVersion = oldPermits.stream().filter(oldPermit -> oldPermit.getLeluVersion().equals(permitModel.getLeluVersion())).collect(Collectors.toList());
            List<PermitModel> permitsWithGreaterVersion = oldPermits.stream().filter(oldPermit -> oldPermit.getLeluVersion() > permitModel.getLeluVersion()).collect(Collectors.toList());
            if (!permitsWithSameVersion.isEmpty()) {
                logger.error("Permit with same permitNumber {} and lelu version {} already exists", permitModel.getPermitNumber(), permitModel.getLeluVersion());
                throw new LeluPermitSaveException(HttpStatus.CONFLICT, messageSource.getMessage("lelu.permit.exists.with.version", null, Locale.ROOT));
            } else if (!permitsWithGreaterVersion.isEmpty()) {
                logger.error("Permits with same permitNumber {} and greater lelu version than {} exist", permitModel.getPermitNumber(), permitModel.getLeluVersion());
                throw new LeluPermitSaveException(HttpStatus.NOT_ACCEPTABLE, messageSource.getMessage("lelu.permits.exist.with.greater.version", null, Locale.ROOT));
            } else {
                for (PermitModel oldPermit : oldPermits) {
                    // If permit with previous version is marked as current, update it
                    if (oldPermit.getIsCurrentVersion()) {
                        permitRepository.updatePermitCurrentVersion(oldPermit.getId(), false);
                    }
                }
                response.setStatus(LeluPermitStatus.UPDATED);
            }
        } else {
            response.setStatus(LeluPermitStatus.CREATED);
        }
        permitModel.setIsCurrentVersion(true);
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


    private Integer getOrCreateCompany(CompanyModel companyModel) {
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
        logger.debug("Bridge missing with oid {}, get from trex", routeBridge.getBridge().getOid());
        try {
            BridgeModel newBridge = trexBridgeInfoService.getBridge(oid);
            return bridgeRepository.createBridge(newBridge);
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


    public LeluPermiPdfResponseDTO uploadPermitPdf(String permitNumber, Integer permitVersion, MultipartFile file) throws PDFUploadException {
        Integer permitId = permitRepository.getPermitIdByPermitNumberAndVersion(permitNumber, permitVersion);
        if (permitId == null) {
            throw new PDFUploadException(messageSource.getMessage("lelu.permit.not.found", null, Locale.ROOT), HttpStatus.NOT_FOUND);
        }
        String objectKey = "permitPdf/" + permitNumber + "_" + permitVersion + "/" + file.getOriginalFilename();


        if (activeProfile.equals("local")) {
            // Save to local file system
            File outputFile = new File("/", file.getOriginalFilename());
            try {
                Files.write(outputFile.toPath(), file.getBytes());
            } catch (IOException e) {
                logger.error("Error writing file." + e.getClass().getName() + " " + e.getMessage());
                throw new PDFUploadException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            // Upload to AWS
            try {
                boolean success = awss3Client.upload(objectKey, file.getBytes(), "application/pdf", awss3Client.getPermitBucketName(), AWSS3Client.SILLARI_BACKEND_ROLE_SESSION_NAME);
                if (!success) {
                    throw new PDFUploadException("Error uploading file to aws.", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            } catch (IOException e) {
                logger.error("Error uploading file to aws." + e.getClass().getName() + " " + e.getMessage());
                throw new PDFUploadException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        permitRepository.updatePermitPdf(permitId, objectKey);

        return new LeluPermiPdfResponseDTO(permitNumber, permitVersion, messageSource.getMessage("lelu.permit.pdf.upload.completed", null, Locale.ROOT));

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
                        SupervisionModel filledSupervision = supervisionService.getSupervision(supervision.getId(), true, false);
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
