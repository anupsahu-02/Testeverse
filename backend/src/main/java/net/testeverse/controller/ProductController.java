package net.testeverse.controller;

import net.testeverse.DTO.ProductRequest;
import net.testeverse.entity.Product;
import net.testeverse.entity.User;
import net.testeverse.service.ProductService;
import net.testeverse.service.UserService;
import net.testeverse.utils.JwtUtil;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.swing.event.HyperlinkEvent;
import java.awt.color.ProfileDataException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addProduct(@ModelAttribute ProductRequest productRequest) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        boolean isSaved = productService.saveProduct(productRequest, username);
        if(isSaved) return new ResponseEntity<>("Product Added", HttpStatus.OK);
        return new ResponseEntity<>("Something Went Wrong!", HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/my-products")
    public ResponseEntity<?> getMyProducts() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Product> products = productService.getProductsByUsername(username);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{publicId}")
    public ResponseEntity<?> deleteProduct(@PathVariable String publicId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        boolean deleted = productService.delete(publicId, username);
        if (deleted) return new ResponseEntity<>("Deleted", HttpStatus.OK);
        return new ResponseEntity<>("Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/add-to-cart/{id}")
    public ResponseEntity<?> addInCart(@PathVariable String id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean added = productService.addInCart(id, username);
        if(added) return new ResponseEntity<>(HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping("/my-cart")
    public List<Product> getCartItem() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUser(username);
        return new ArrayList<>(user.getCarts().values());
    }

    @DeleteMapping("/my-cart/remove/{id}")
    public ResponseEntity<?> removeItemFromCart(@PathVariable String id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        productService.removeFromCart(id, username);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
