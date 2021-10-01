package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.repositories.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CompanyService {
    private static final Logger logger = LogManager.getLogger();
    @Autowired
    CompanyRepository companyRepository;
    @Autowired
    PermitRepository permitRepository;
    @Autowired
    RouteRepository routeRepository;
    @Autowired
    RouteBridgeRepository routeBridgeRepository;

    public List<CompanyModel> getCompanies(Integer limit) {
        List<CompanyModel> companies = companyRepository.getAllCompanies(limit);
        for(CompanyModel companyModel : companies) {
            companyModel.setPermits(permitRepository.getPermitsByCompanyId(companyModel.getId()));
            for(PermitModel permitModel : companyModel.getPermits()) {
                permitModel.setRoutes(routeRepository.getRoutesByPermitId(permitModel.getId()));
                for(RouteModel routeModel : permitModel.getRoutes()) {
                    List<RouteBridgeModel> routeBridgeModels = routeBridgeRepository.getRoutesBridges(routeModel.getId());
                    routeModel.setRouteBridges(routeBridgeModels);
                }
            }
        }
        return companies;
    }

    public List<CompanyModel> getCompanyList(Integer limit) {
        if (limit >= 0) {
            List<CompanyModel> companyList = companyRepository.getAllCompanies(limit);
            for (CompanyModel companyModel : companyList) {
                companyModel.setPermits(permitRepository.getPermitsByCompanyId(companyModel.getId()));
            }
            return companyList;
        } else {
            return new ArrayList<>();
        }
    }

    public CompanyModel getCompany(Integer id) {
        CompanyModel company = companyRepository.getCompanyById(id);
        company.setPermits(permitRepository.getPermitsByCompanyId(id));
        for (PermitModel permitModel : company.getPermits()) {
            permitModel.setRoutes(routeRepository.getRoutesByPermitId(permitModel.getId()));
        }
        return company;
    }
}
