package net.testeverse.service;

import net.testeverse.entity.Order;
import net.testeverse.entity.Restaurant;
import net.testeverse.entity.User;
import net.testeverse.repository.OrderRepository;
import net.testeverse.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private OrderRepository orderRepository;

    public boolean addNewRestaurant(Restaurant restaurant, String username) {
        try {
            User user = userService.getUser(username);
            restaurant.setOwner(user);
            Restaurant saved = restaurantRepository.save(restaurant);
            user.setRestaurant(saved);
            user.setSeller(true);
            userService.saveUser(user);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public List<Order> getOrders(String username) {
        User user = userService.getUser(username);
        String restaurantId = user.getRestaurant().getId();
        List<Order> orders = orderRepository.findByRestaurant(restaurantId);

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
