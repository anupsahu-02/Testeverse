package net.testeverse.controller;

import net.testeverse.entity.Order;
import net.testeverse.entity.Restaurant;
import net.testeverse.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/users/restaurant")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @PostMapping("/config")
    public ResponseEntity<?> newRestaurant(@RequestBody Restaurant restaurant) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean saved = restaurantService.addNewRestaurant(restaurant, username);
        if (saved) return new ResponseEntity<>("Restaurant Has been Added Successfully", HttpStatus.OK);
        else return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/orders")
    public List<Order> orders() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return restaurantService.getOrders(username);
    }
}
