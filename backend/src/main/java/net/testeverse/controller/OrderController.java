package net.testeverse.controller;

import net.testeverse.entity.Order;
import net.testeverse.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("users/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/add-order")
    public ResponseEntity<?> addNewOrder(@RequestBody Order order) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            orderService.saveNewOrder(order, username);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get-orders")
    public List<Order> getOrders() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return orderService.getOrders(username);
    }

    @PutMapping()
    public Order changeStatusDelivered(@RequestBody Order order) {
        order.setStatus("DELIVERED");
        order.setDeliveredAt(LocalDateTime.now());
        return orderService.save(order);
    }
}
