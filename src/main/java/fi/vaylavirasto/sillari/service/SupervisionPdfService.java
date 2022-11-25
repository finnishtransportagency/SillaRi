package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.SupervisionPdfModel;
import fi.vaylavirasto.sillari.repositories.SupervisionPdfRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
public class SupervisionPdfService {
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

    public void updateSupervisionPdfStatus(SupervisionPdfModel pdfModel) {
        pdfModel.setStatusTime(OffsetDateTime.now());
        supervisionPdfRepository.updateSupervisionPdfStatus(pdfModel);
    }

}
