package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.FileModel;
import fi.vaylavirasto.sillari.repositories.CrossingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FileService {
    @Autowired
    CrossingRepository crossingRepository;
    public FileModel createFile(FileModel fileModel) {
        Integer id = crossingRepository.insertFile(fileModel);
        return crossingRepository.getFile(id);
    }
}
