package net.testeverse.controller;

import net.testeverse.entity.User;
import net.testeverse.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;

@Component
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping()
    public ResponseEntity<User> getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userService.getUser(username);
        if(user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @PostMapping("/add-address")
    public ResponseEntity<?> addAddress(@RequestBody HashMap address) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.getUser(username);
        HashSet<String> addresses = user.getAddress();
        if(addresses.size() >= 5) return new ResponseEntity<>("You can save only 5 Address", HttpStatus.BAD_REQUEST);
        addresses.add(address.get("address").toString());
        user.setAddress(addresses);
        userService.saveUser(user);
        return new ResponseEntity<>("Added", HttpStatus.OK);
    }

    @GetMapping("/get-address")
    public ResponseEntity<?> getAddress() {
        try {
            Thread.sleep(1000);
        } catch (Exception e) {
            System.out.println(e);
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.getUser(username);
        HashSet<String> address = user.getAddress();
        return new ResponseEntity<>(address.toArray(), HttpStatus.OK);
    }

    @DeleteMapping("/delete-address/{address}")
    public ResponseEntity<?> getAddress(@PathVariable String address) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.getUser(username);
        HashSet<String> addresses = user.getAddress();
        addresses.remove(address);
        user.setAddress(addresses);
        userService.saveUser(user);
        return new ResponseEntity<>(user.getAddress(), HttpStatus.OK);
    }

    @GetMapping("/isSeller")
    public boolean isSeller() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.getUser(username);
        return user.isSeller();
    }
}
