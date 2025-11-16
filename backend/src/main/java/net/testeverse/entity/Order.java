package net.testeverse.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

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

    private String customer_name;

    @DBRef(lazy = true)
    private Restaurant restaurant;
}
