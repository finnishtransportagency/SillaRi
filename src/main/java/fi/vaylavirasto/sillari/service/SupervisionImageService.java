package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.SupervisionImageModel;
import fi.vaylavirasto.sillari.repositories.SupervisionImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SupervisionImageService {
    @Autowired
    SupervisionImageRepository supervisionImageRepository;

    public SupervisionImageModel createFile(SupervisionImageModel supervisionImage) {
        Integer id = supervisionImageRepository.insertFileIfNotExists(supervisionImage);
        return supervisionImageRepository.getFile(id);
    }

    public int deleteFile(String objectKey) {
        return supervisionImageRepository.deleteFileByObjectKey(objectKey);
    }

}
