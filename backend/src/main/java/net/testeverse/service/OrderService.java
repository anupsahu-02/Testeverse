package net.testeverse.service;

import net.testeverse.entity.Order;
import net.testeverse.entity.Product;
import net.testeverse.entity.User;
import net.testeverse.repository.OrderRepository;
import net.testeverse.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductRepository productRepository;

    public void saveNewOrder(Order order, String username) {
        User user = userService.getUser(username);
        String productId = order.getProductId();
        Product product = productRepository.findById(productId);
        order.setOrderedAt(LocalDateTime.now());
        order.setCustomer_name(user.getUsername());
        order.setRestaurant(product.getRestaurant());
        Order savedOrder = orderRepository.save(order);
        user.getOrders().add(savedOrder);
        userService.saveUser(user);
    }

    public Order save(Order order) {
        Order savedOrder = orderRepository.save(order);
        return savedOrder;
    }

    public List<Order> getOrders(String username) {
        User user = userService.getUser(username);
        List<Order> orders = user.getOrders();

        List<Order> pendingOrders = new ArrayList<>();
        List<Order> deliveredOrders = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        orders.sort(Comparator.comparing(order -> Duration.between(order.getOrderedAt(), now)));
        for(Order order : orders) {
            if(order.getStatus().equals("PENDING")) {
                pendingOrders.add(order);
            } else {
                deliveredOrders.add(order);
            }
        }
        List<Order> finalOrders = new ArrayList<>();
        finalOrders.addAll(pendingOrders);
        finalOrders.addAll(deliveredOrders);
        return finalOrders;
    }

}
