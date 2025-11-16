package net.testeverse.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.mongodb.lang.NonNull;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

@Document(collection = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;

    @NonNull
    @Indexed(unique = true)
    private String username;

    @NonNull
    private String password;

    @NonNull
    private String email;

    private List<String> roles = new ArrayList<>();

    private HashSet<String> address = new HashSet<>();

    private boolean seller;

    @DBRef(lazy = true)
    private Restaurant restaurant;

    @DBRef(lazy = true)
    private List<Product> products = new ArrayList<>();

    @DBRef(lazy = true)
    private HashMap<String, Product> carts = new HashMap<>();

    @DBRef(lazy = true)
    private List<Order> orders = new ArrayList<>();
}
