package net.testeverse.controller;

import net.testeverse.entity.Product;
import net.testeverse.entity.User;
import net.testeverse.service.ProductService;
import net.testeverse.service.UserDetailsServiceImp;
import net.testeverse.service.UserService;
import net.testeverse.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/public")
public class PublicController {

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImp userDetailsServiceImp;

    @GetMapping("/health-check")
    public String healthCheck() {
        return "OK";
    }

    @GetMapping("/get-user/{token}")
    public ResponseEntity<?> getUser(@PathVariable String token) {
        Boolean isValid = jwtUtil.validateToken(token);
        if(isValid) {
            String username = jwtUtil.extractUsername(token);
            User user = userService.getUser(username);
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {

        boolean save = userService.saveNewUser(user);
        if (save) {
            return new ResponseEntity<>("User Registered", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("User Already Exist", HttpStatus.SEE_OTHER);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        try {
            Thread.sleep(1000);
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    user.getUsername(), user.getPassword()));

            UserDetails userDetails = userDetailsServiceImp.loadUserByUsername(user.getUsername());
            String jwt = jwtUtil.generateToken(userDetails.getUsername());
            return new ResponseEntity<>(jwt, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Incorrect username or password", HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/validate-token/{token}")
    public ResponseEntity<?> isValidToken(@PathVariable String token) {
        Boolean isValid = jwtUtil.validateToken(token);
        if(isValid) {
            return new ResponseEntity<>("true", HttpStatus.OK);
        }
        return new ResponseEntity<>("true", HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/all-products")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAll();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}
