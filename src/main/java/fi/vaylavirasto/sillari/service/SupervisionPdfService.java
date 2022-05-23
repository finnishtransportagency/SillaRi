package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.SupervisionPdfModel;
import fi.vaylavirasto.sillari.repositories.SupervisionPdfRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SupervisionPdfService {
    private static final Logger logger = LogManager.getLogger();
    @Autowired
    SupervisionPdfRepository supervisionPdfRepository;

    public SupervisionPdfModel getSupervisionPdf(Integer id) {
        return supervisionPdfRepository.getSupervisionPdf(id);
    }

    public SupervisionPdfModel getSupervisionPdfBySupervisionId(Integer supervisionId) {
        return supervisionPdfRepository.getSupervisionPdfBySupervisionId(supervisionId);
    }

    public SupervisionPdfModel createSupervisionPdf(SupervisionPdfModel pdfModel) {
        Integer pdfId = supervisionPdfRepository.createSupervisionPdf(pdfModel);
        return getSupervisionPdf(pdfId);
    }

}
