package net.testeverse.controller;

import net.testeverse.entity.User;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class PublicControllerTest {

    @MockBean
    private PublicController publicController;

    @MockBean
    private User user;


    @Test
    public void healthCheckTest() {
        String check = publicController.healthCheck();
        assertEquals("OK", check);
    }

    @Test
    public void signup() {
        User user = User.builder().username("As").password("As").email("as@gmail.com").build();
        ResponseEntity<?> response = publicController.signup(user);
        assertEquals("User Registered", response.getBody());
    }

    @Disabled
    @ParameterizedTest
    @CsvSource({
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBcyIsImlhdCI6MTc2MDA3ODk2MCwiZXhwIjoxNzYwMDgyNTYwfQ.KsgLi2EBX4QhD5i9oUdETa9RW4KeKM4Eo_f9TZkjEgw"
    })
    public void isValidTokenTest(String token) {
        assertEquals(true, publicController.isValidToken(token));
    }
}
