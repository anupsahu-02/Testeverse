package net.testeverse.service;

import net.testeverse.entity.Order;
import net.testeverse.entity.User;
import net.testeverse.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserService userService;

    public void saveNewOrder(Order order, String username) {
        User user = userService.getUser(username);
        order.setDeliverd(false);
        order.setDate(new Date());
        Order savedOrder = orderRepository.save(order);
        user.getOrders().add(savedOrder);
        userService.saveUser(user);
    }

    public List<Order> getOrders(String username) {
        User user = userService.getUser(username);
        return user.getOrders();
    }

}
