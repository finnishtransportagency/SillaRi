package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.api.rest.LeluRouteUploadResponseWrapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.Set;


@Service
public class LeluRouteUploadUtil {
    private static final Logger logger = LogManager.getLogger();
    public static final String LELU_IMPORT_ROUTE_SCRIPT_SH = "classpath:lelu_import_route_zip.sh";
    public static final String LELU_IMPORT_ROUTE_SCRIPT_SH_COMMAND = "./lelu_import_route_zip.sh";


    @Autowired
    ResourceLoader resourceLoader;

    public ResponseEntity<?> doRouteGeometryUpload(Integer calculationId, MultipartFile file, String routeUploadPath) {

        try {
            File routeUploadDirectory = new File(routeUploadPath);
            logger.debug("routeUploadPath: " + routeUploadPath);
            if (routeUploadDirectory.exists() && routeUploadDirectory.isDirectory() && routeUploadDirectory.canWrite()) {
                if (calculationId != null && calculationId > 0 && file != null && !file.isEmpty()) {
                    // Save the file to the path specified in the config
                    logger.debug("hello.1: " + file.getOriginalFilename());
                    Path fullPath = Paths.get(routeUploadPath, file.getOriginalFilename());
                    logger.debug("hello0x: " + fullPath.toString());
                    file.transferTo(fullPath);

                    //copy script to the working dir
                    Resource r = resourceLoader.getResource(LELU_IMPORT_ROUTE_SCRIPT_SH);
                    InputStream inputStream = r.getInputStream();


                    Path fullScriptPath = Paths.get(routeUploadPath, LELU_IMPORT_ROUTE_SCRIPT_SH_COMMAND);
                    logger.debug("hello2: " + fullScriptPath.toString());
                    Files.write(fullScriptPath, inputStream.readAllBytes());

                    Set<PosixFilePermission> perms = PosixFilePermissions.fromString("rwxrwxrwx");
                    Files.setPosixFilePermissions(fullScriptPath, perms);



                    // Define a command line process for running the import script
                    ProcessBuilder ogr2ogr = new ProcessBuilder();
                    ogr2ogr.command(LELU_IMPORT_ROUTE_SCRIPT_SH_COMMAND, file.getOriginalFilename(), calculationId.toString());
                    ogr2ogr.directory(new File(routeUploadPath));
                    ogr2ogr.inheritIO();

                    // Write the script output to the debug logger
                    ogr2ogr.command().forEach(logger::debug);

                    // Run the process and check the result to see if it worked
                    Process process = ogr2ogr.start();
                    process.waitFor();
                    int result = process.exitValue();

                    if (result != 0) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new LeluRouteUploadResponseWrapper(result, "Error uploading route geometry file"));
                    }

                    String message = "Upload succeeded!";
                    logger.debug(message);

                    return ResponseEntity.status(HttpStatus.OK).body(new LeluRouteUploadResponseWrapper(result, message));
                } else if (file == null || file.isEmpty()) {
                    String message = "File is empty!";
                    logger.debug(message);

                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new LeluRouteUploadResponseWrapper(-1, message));
                } else {
                    String message = "Calculation id is not specified!";
                    logger.debug(message);

                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new LeluRouteUploadResponseWrapper(-1, message));
                }
            } else {
                String message = "Upload directory is invalid!";
                logger.debug(message);

                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new LeluRouteUploadResponseWrapper(-1, message));
            }
        } catch (Exception ex) {
            String message = "Error uploading route geometry file!";
            logger.error(message, ex);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new LeluRouteUploadResponseWrapper(-1, message));
        }
    }
}
