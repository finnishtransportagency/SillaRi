package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.AuthorizationModel;
import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.model.CrossingModel;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.repositories.AuthorizationRepository;
import fi.vaylavirasto.sillari.repositories.CompanyRepository;
import fi.vaylavirasto.sillari.repositories.CrossingRepository;
import fi.vaylavirasto.sillari.repositories.RouteRepository;
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
    AuthorizationRepository authorizationRepository;
    @Autowired
    RouteRepository routeRepository;
    @Autowired
    CrossingRepository crossingRepository;

    public List<CompanyModel> getCompanies(Integer limit) {
        List<CompanyModel> companies = companyRepository.getAllCompanies(limit);
        for(CompanyModel companyModel : companies) {
            companyModel.setAuthorizations(authorizationRepository.getCompanysAuthorizations(Long.valueOf(companyModel.getId()).intValue()));
            for(AuthorizationModel authorizationModel: companyModel.getAuthorizations()) {
                authorizationModel.setRoutes(routeRepository.getRoutes(Long.valueOf(authorizationModel.getId()).intValue()));
                for(RouteModel routeModel : authorizationModel.getRoutes()) {
                    List<CrossingModel> crossingModels = crossingRepository.getRoutesCrossings(Long.valueOf(routeModel.getId()).intValue());
                    routeModel.setCrossings(crossingModels);
                }
            }
        }
        return companies;
    }

    public List<CompanyModel> getCompanyList(Integer limit) {
        if (limit >= 0) {
            List<CompanyModel> companyList = companyRepository.getAllCompanies(limit);
            for (CompanyModel companyModel : companyList) {
                companyModel.setAuthorizations(authorizationRepository.getCompanysAuthorizations(Long.valueOf(companyModel.getId()).intValue()));
            }
            return companyList;
        } else {
            return new ArrayList<>();
        }
    }

    public CompanyModel getCompany(Integer id) {
        CompanyModel company = companyRepository.getCompanyById(id);
        company.setAuthorizations(authorizationRepository.getCompanysAuthorizations(id));
        for (AuthorizationModel authorizationModel : company.getAuthorizations()) {
            authorizationModel.setRoutes(routeRepository.getRoutes(Long.valueOf(authorizationModel.getId()).intValue()));
        }
        return company;
    }
}
