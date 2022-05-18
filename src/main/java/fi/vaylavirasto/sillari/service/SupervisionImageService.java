package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.SupervisionImageModel;
import fi.vaylavirasto.sillari.repositories.SupervisionImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupervisionImageService {
    @Autowired
    SupervisionImageRepository supervisionImageRepository;

    public List<SupervisionImageModel> getSupervisionImages(Integer supervisionId) {
        return supervisionImageRepository.getFiles(supervisionId);
    }

    public SupervisionImageModel getSupervisionImage(Integer id) {
        return supervisionImageRepository.getFile(id);
    }

    public SupervisionImageModel createFile(SupervisionImageModel supervisionImage) {
        Integer id = supervisionImageRepository.insertFileIfNotExists(supervisionImage);
        return supervisionImageRepository.getFile(id);
    }

    public SupervisionImageModel updateObjectKey(Integer id, String objectKey) {
        supervisionImageRepository.updateObjectKey(id, objectKey);
        return supervisionImageRepository.getFile(id);
    }

    public int deleteSupervisionImage(Integer id) {
        return supervisionImageRepository.deleteFileByImageId(id);
    }

    public int deleteSupervisionImages(Integer supervisionId) {
        return supervisionImageRepository.deleteFilesBySupervisionId(supervisionId);
    }

}
