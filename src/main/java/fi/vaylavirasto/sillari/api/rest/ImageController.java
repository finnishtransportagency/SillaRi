package fi.vaylavirasto.sillari.api.rest;

import com.amazonaws.util.IOUtils;
import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.model.TransportModel;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Base64;
import java.util.List;

@RestController
@Timed
@RequestMapping("/images")
public class ImageController {
    @Autowired
    AWSS3Client awss3Client;
    @Operation(summary = "Get all transports")
    @GetMapping
    @RequestMapping(value = "get", method = RequestMethod.GET)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public void getImage(HttpServletResponse response, @RequestParam String objectKey) throws IOException {
        ServiceMetric serviceMetric = new ServiceMetric("ImageController", "getImage");
        try {
            byte image[] = awss3Client.download(new String(Base64.getDecoder().decode(objectKey)));
            response.setContentType("image/jpeg");
            OutputStream out = response.getOutputStream();
            ByteArrayInputStream in = new ByteArrayInputStream(image);
            IOUtils.copy(in, out);
            out.close();
            in.close();
        } finally {
            serviceMetric.end();
        }
    }
}
