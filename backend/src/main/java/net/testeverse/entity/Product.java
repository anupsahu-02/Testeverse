package net.testeverse.entity;

import com.mongodb.lang.NonNull;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

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

    @DBRef(lazy = true)
    private Restaurant restaurant;
}
