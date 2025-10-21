package net.testeverse.controller;

import net.testeverse.DTO.ProductRequest;
import net.testeverse.entity.Product;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.web.multipart.MultipartFile;

@SpringBootTest
public class ProductControllerTest {

    @MockBean
    private ProductController productController;

}
