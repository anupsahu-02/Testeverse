package net.testeverse.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public Map uploadImage(MultipartFile multipartFile) throws IOException {
        try {
            return cloudinary.uploader().upload(multipartFile.getBytes(), ObjectUtils.asMap("resource_type", "auto"));
        } catch (Exception e) {
            throw e;
        }
    }

}
