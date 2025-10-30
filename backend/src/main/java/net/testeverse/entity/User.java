package net.testeverse.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mongodb.lang.NonNull;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

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

    @Id  // unique key
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

    @DBRef
    private Restaurant restaurant;

    @DBRef
    private List<Product> products = new ArrayList<>();

    @DBRef
    private HashMap<String, Product> carts = new HashMap<>();

    @JsonIgnore
    @DBRef
    private List<Order> orders = new ArrayList<>();
}
