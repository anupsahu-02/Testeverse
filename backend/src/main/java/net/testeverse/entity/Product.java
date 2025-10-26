package net.testeverse.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import net.testeverse.repository.RestaurantRepository;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

@Document(collection = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    private String id;

    @NonNull
    private String name;

    private double price;

    private String imageUrl;

    private String publicId;

    @JsonIgnore
    @JsonManagedReference
    @DBRef(lazy = false)
    private Restaurant restaurant;

}
