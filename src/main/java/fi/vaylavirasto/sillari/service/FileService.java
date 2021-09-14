package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.FileModel;
import fi.vaylavirasto.sillari.repositories.FileRepository;
import fi.vaylavirasto.sillari.repositories.CrossingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FileService {
    @Autowired
    FileRepository fileRepository;

    @Autowired
    CrossingRepository crossingRepository;

    public FileModel createFile(FileModel fileModel) {
        Integer id = fileRepository.insertFileIfNotExists(fileModel);
        return fileRepository.getFile(id);
    }

    public int deleteFile(String objectKey) {
        return crossingRepository.deleteFileByObjectKey(objectKey);
    }
}
