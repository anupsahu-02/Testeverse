package net.testeverse.controller;

import net.testeverse.entity.Order;
import net.testeverse.repository.OrderRepository;
import net.testeverse.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
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
    private MongoTemplate mongoTemplate;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

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

    @PutMapping("/{id}/deliver")
    public Order changeStatusDelivered(@PathVariable String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(id));

        Update update = new Update()
                .set("status", "DELIVERED")
                .set("deliveredAt", LocalDateTime.now());

        mongoTemplate.updateFirst(query, update, Order.class);

        return mongoTemplate.findById(id, Order.class);
    }
}

/*
    Heroku simplifies our development process.
    We have to push our code over heroku git repository via url given by them
    Then all work will be automatically done (like, packaging, java -jar run etc.
    We call this process CI/CD (Continuous Integration, Continuous Deployment)

    Process - git install, account on heroku, push code on heroku

 */