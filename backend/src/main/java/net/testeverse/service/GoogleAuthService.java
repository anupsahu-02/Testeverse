package net.testeverse.service;

import net.testeverse.entity.User;
import net.testeverse.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class GoogleAuthService {
    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.google.redirect-url}")
    private String redirectUri;

    public String getTokens(String code) {
        try {
            // Exchange auth code for tokens
            String tokenEndpoint = "https://oauth2.googleapis.com/token";

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("code", code);
            params.add("client_id", clientId);
            params.add("client_secret", clientSecret);
            params.add("redirect_uri", redirectUri);
            params.add("grant_type", "authorization_code");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

            ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(tokenEndpoint, request, Map.class);

            String idToken = tokenResponse.getBody().get("id_token").toString();
            String userInfoUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;

            ResponseEntity<Map> userInfoResponse = restTemplate.getForEntity(userInfoUrl, Map.class);

            if(tokenResponse.getStatusCode() == HttpStatus.OK) {
                Map userInfo = userInfoResponse.getBody();
                String email = userInfo.get("email").toString();

                User userDetails = userService.getUser(email);

                if(userDetails == null) {
                    User user = new User();
                    user.setEmail(email);
                    user.setUsername(email);
                    user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                    user.setRoles(Arrays.asList("USER"));
                    userService.saveNewUser(user);
                }

                return jwtUtil.generateToken(email);
            }
            throw new Error("Something went wrong");
        } catch (Exception e) {
            return e.getMessage();
        }
    }

}
