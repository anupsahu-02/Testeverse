package net.testeverse.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

public class CorsConfig implements WebMvcConfigurer {

//    @Override
//    public void addCorsMappings(CorsRegistry corsRegistry) {
//        corsRegistry.addMapping("/**")
//                .allowedOrigins("*") // Allows all domains
//                .allowedMethods("*")   // Allows all methods
//                .allowedHeaders("*")    // allowed headers to send to the backend
//                .exposedHeaders("Authorization") // allowed headers to read from the backend's response
//                .allowCredentials(true);
//    }
}
