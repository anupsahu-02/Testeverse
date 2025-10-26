package net.testeverse.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.time.LocalDateTime;
import java.util.Date;

@Document(collection = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    private String id;

    private String productId;

    private LocalDateTime orderedAt;

    private LocalDateTime deliveredAt;

    private String name;

    private String status = "PENDING";

    private double totalAmount;

    private String imageUrl;

    private String address;

    @DocumentReference(lazy = true)
    @DBRef
    private User customer;

    @DBRef
    private Restaurant restaurant;
}
