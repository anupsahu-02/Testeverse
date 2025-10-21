package net.testeverse.service;

import net.testeverse.entity.Order;
import net.testeverse.entity.Product;
import net.testeverse.entity.User;
import net.testeverse.repository.UserRepository;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
public class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @MockBean
    private Order order;

    @Autowired
    private UserService userService;

//    @Disabled
//    @Test
//    public void addNewOrderTest() {
//        User user = userService.getUser("As");
//        Product product = user.getProducts().get(0);
//        Order order = Order.builder().isDeliverd(false).location("Telaimuda").product(product).product();
//        orderService.saveNewOrder(order, "as");
//        user.getOrders().add(order);
//        boolean saveUser = userService.saveUser(user);
//    }
}
