package fi.vaylavirasto.sillari.util;

import fi.vaylavirasto.sillari.api.rest.LeluRouteUploadResponseWrapper;

import org.apache.commons.io.FileUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.*;

import java.nio.charset.StandardCharsets;



@Service
public class LeluRouteUploadUtil {
    private static final Logger logger = LogManager.getLogger();
    public static final String LELU_IMPORT_ROUTE_SCRIPT_FILENAME = "lelu_import_route_zip.sh";

    @Autowired
    ResourceLoader resourceLoader;

    @Value("${sillari.lelu.routeuploadpath}")
    private String routeUploadPathString;

    @Value("${spring.datasource.url}")
    private String datasourceUrl;

    @Value("${spring.datasource.username}")
    private String datasourceUsername;

    @Value("${spring.datasource.password}")
    private String datasourcePassword;


    public ResponseEntity<?> doRouteGeometryUpload(Long routeId, MultipartFile file) {

        try {
            String connectionString = constructConnectionString(datasourceUrl, datasourceUsername, datasourcePassword);
            File routeUploadDirectory = new File(routeUploadPathString);
            logger.debug("routeUploadPath: " + routeUploadPathString);
            logger.debug("connectionString: " + connectionString);
            if (routeUploadDirectory.exists() && routeUploadDirectory.isDirectory() && routeUploadDirectory.canWrite()) {
                if (routeId != null && routeId > 0 && file != null && !file.isEmpty()) {
                    // Save the file to the path specified in the config
                    String zipFileName = file.getOriginalFilename();
                    logger.debug("zip filename " + zipFileName);
                    Path zipFilePath = Paths.get(routeUploadPathString, zipFileName);
                    logger.debug("zipFilePath: " + zipFilePath.toString());
                    file.transferTo(zipFilePath);

                    //maybe file is base64; try decode
                    try {
                        String newFileName = routeUploadPathString+"/"+zipFileName+".zip";
                        logger.debug("newFileName: " + newFileName);
                        String fileString = Files.readString(zipFilePath, StandardCharsets.US_ASCII);
                        FileUtils.writeByteArrayToFile(new File(newFileName), MyAwesomeBase64.getDecoder().decode(fileString));
                        zipFileName = newFileName;
                        logger.debug("created fiel in:" + newFileName);

                    }
                    catch (Exception e){
                        logger.debug("couldnt base64 decode, prolly isnt encoded. " + e.getMessage());
                        //add zip extension if missing
                        if(!zipFileName.toLowerCase().endsWith(".zip")){
                            String newZipFileName = zipFileName + ".zip";
                            Path newZipFilePath = Paths.get(routeUploadPathString, newZipFileName);
                            Files.move(zipFilePath, newZipFilePath);
                            zipFilePath = newZipFilePath;
                            zipFileName = newZipFileName;
                        }
                    }



                    Set<PosixFilePermission> perms = PosixFilePermissions.fromString("rwxrwxrwx");
                    Files.setPosixFilePermissions(zipFilePath, perms);

                    //copy script to the working dir
                    Resource r = resourceLoader.getResource("classpath:"+LELU_IMPORT_ROUTE_SCRIPT_FILENAME);
                    InputStream inputStream = r.getInputStream();


                    Path fullScriptPath = Paths.get(routeUploadPathString, LELU_IMPORT_ROUTE_SCRIPT_FILENAME);
                    logger.debug("script path: " + fullScriptPath.toString());
                    Files.write(fullScriptPath, inputStream.readAllBytes());

                    Files.setPosixFilePermissions(fullScriptPath, perms);




                    // Define a command line process for running the import script
                    ProcessBuilder ogr2ogr = new ProcessBuilder();
                    ogr2ogr.command("./"+LELU_IMPORT_ROUTE_SCRIPT_FILENAME, zipFileName, routeId.toString(), connectionString);
                    ogr2ogr.directory(new File(routeUploadPathString));
                    ogr2ogr.inheritIO();




                    // Write the script output to the debug logger
                    ogr2ogr.command().forEach((String a) -> logger.debug("Script param: " + a));

                    //log script out to a temp file
                    final String tempLogFileName = routeUploadPathString +"/routeImport"+routeId+".log";
                    File log = new File(tempLogFileName);
                    ogr2ogr.redirectErrorStream(true);/*from w w w .  j  av a 2  s. c o m*/
                    ogr2ogr.redirectOutput(ProcessBuilder.Redirect.appendTo(log));

                    // Run the process and check the result to see if it worked
                    Process process = ogr2ogr.start();

                               process.waitFor();
                    int result = process.exitValue();



                    if (result != 0) {
                        logger.error("Error uploading route file: " + result);
                        logTempFile(tempLogFileName, true);
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new LeluRouteUploadResponseWrapper(result, "Error uploading route geometry file"));
                    }

                    String message = "Upload succeeded!";
                    logger.debug(message);
                    logTempFile(tempLogFileName, false);
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
            String message = "Exception while uploading route geometry file!";
            logger.error(message, ex);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new LeluRouteUploadResponseWrapper(-1, message));
        }
    }

    private void logTempFile(String tempLogFileName, boolean isError) {
        Path path = Paths.get(tempLogFileName);
        try {
            List<String> lines = Files.readAllLines(path);
            for(String line: lines){
                if(isError){
                    logger.error("IMPORT SCRIPT ERROR: " +line);
                }else{
                    logger.debug("IMPORT SCRIPT DEBUG: " +line);
                }
            }
            Files.delete(path);
        } catch (IOException e) {
            e.printStackTrace();
            logger.warn("Error logging import script out.");
        }


    }

    private String constructConnectionString(String datasourceUrl, String datasourceUsername, String datasourcePassword) {
       // jdbc:postgresql://sillari-local-db:5432/sillari
        //"host=sillari-local-db  port=5432 dbname=sillari user=sillari password=sillari1234"
       String tmp =  datasourceUrl.split("//")[1];
       String host = tmp.split(":")[0];
       tmp = tmp.split(":")[1];
       String port = tmp.split("/")[0];
       String dbName = tmp.split("/")[1];
       return "host=" + host + " port="+port+ " dbname="+ dbName +" user="+datasourceUsername +" password="+datasourcePassword;
    }
}


//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

