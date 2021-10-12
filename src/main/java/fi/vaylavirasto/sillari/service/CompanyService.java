package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.repositories.CompanyRepository;
import fi.vaylavirasto.sillari.repositories.PermitRepository;
import fi.vaylavirasto.sillari.repositories.RouteRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public List<CompanyModel> getCompaniesOfSupervisor(String username) {
        List<CompanyModel> companies = companyRepository.getCompaniesOfSupervisor(username);
        for (CompanyModel company : companies) {
            company.setPermits(permitRepository.getPermitsByCompanyId(company.getId()));
        }
        return companies;
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
