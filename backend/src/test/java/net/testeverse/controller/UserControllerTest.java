package net.testeverse.controller;

import net.testeverse.entity.User;
import net.testeverse.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UserControllerTest {

    @Autowired
    private UserService userService;

    @ParameterizedTest
    @CsvSource({
            "As",
            "Mona",
            "Gol"
    })
    public void getUser(String username) {
        User user = userService.getUser(username);
        int a = 10;
    }
}
