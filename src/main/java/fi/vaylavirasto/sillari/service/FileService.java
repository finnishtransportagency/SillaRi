package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.FileModel;
import fi.vaylavirasto.sillari.repositories.SupervisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FileService {
    @Autowired
    SupervisionRepository supervisionRepository;

    public FileModel createFile(FileModel fileModel) {
        Integer id = supervisionRepository.insertFileIfNotExists(fileModel);
        return supervisionRepository.getFile(id);
    }
}
