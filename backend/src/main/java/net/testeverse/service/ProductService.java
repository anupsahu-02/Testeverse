package net.testeverse.service;


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import net.testeverse.DTO.ProductRequest;
import net.testeverse.entity.Product;
import net.testeverse.entity.User;
import net.testeverse.repository.ProductRepository;
import net.testeverse.repository.ProductRepositoryImpl;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;
import java.util.Map;
import java.lang.String;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ProductService {

    @Autowired
    private ProductRepositoryImpl productRepositoryImpl;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private Cloudinary cloudinary;

    public boolean saveProduct(ProductRequest productRequest, String username) {
        try {
            Map uploadResult = cloudinaryService.uploadImage(productRequest.getImage());
            User user = userService.getUser(username);
            String imageUrl = uploadResult.get("url").toString();
            String publicId = uploadResult.get("public_id").toString();
            Product product = Product.builder().name(productRequest.getName()).price(productRequest.getPrice()).
                    imageUrl(imageUrl).publicId(publicId).build();
            product.setRestaurant(user.getRestaurant());
            Product savedProduct = productRepository.save(product);

            if(savedProduct.getId() != null) {
                user.getProducts().add(savedProduct);

                return userService.saveUser(user);
            }

            return false;
        } catch (Exception e) {
            return false;
        }
    }

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByUsername(String username) {
        User user = userService.getUser(username);
        return user.getProducts();
    }

    public boolean delete(String publicId, String username) {
        try {
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            productRepositoryImpl.deleteProductByPublicId(publicId);
            User user = userService.getUser(username);
            List<Product> products = user.getProducts();
            List<Product> filtered = products.stream().filter((product -> product != null && !product.getPublicId().equals(publicId))).collect(Collectors.toList());
            user.setProducts(filtered);
            userService.saveUser(user);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean addInCart(String id, String username) {
        try {
            Product product = productRepositoryImpl.getProductById(id);
            User user = userService.getUser(username);
            user.getCarts().put(product.getId(), product);
            userService.saveUser(user);
            return true;
        } catch (Exception e) {
            return false;
        }
    }


    public void removeFromCart(String productId, String username) {
        User user = userService.getUser(username);
        user.getCarts().remove(productId);
        userService.saveUser(user);
    }
}
