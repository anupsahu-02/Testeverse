package net.testeverse.controller;

import net.testeverse.service.GoogleAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth/google")
public class GoogleAuthController {

    @Autowired
    private GoogleAuthService googleAuthService;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.redirect-url}")
    private String redirectUri;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @GetMapping("/url")
    public Map<String, String> getGoogleAuthUrl() {
        String url =
                "https://accounts.google.com/o/oauth2/v2/auth"
                        + "?client_id=" + clientId
                        + "&redirect_uri=" + redirectUri
                        + "&response_type=code"
                        + "&scope=email%20profile"
                        + "&access_type=offline"
                        + "&prompt=consent";

        Map<String, String> response = new HashMap<>();
        response.put("url", url);
        return response;
    }

    @GetMapping("/callback")
    public void handleGoogleCallback(@RequestParam(required = false) String code, @RequestParam(required = false) String error, HttpServletResponse response) throws IOException {
        try {
            if(error != null) {
                String redirectUrl = frontendUrl + "/auth";
                response.sendRedirect(redirectUrl);
                return;
            }
            String jwtToken = googleAuthService.getTokens(code);
            String redirectUrl = frontendUrl + "/google-success?token=" + jwtToken;
            response.sendRedirect(redirectUrl);
        } catch (Exception e) {
            String redirectUrl = frontendUrl + "/auth";
            response.sendRedirect(redirectUrl);
        }
    }
}
