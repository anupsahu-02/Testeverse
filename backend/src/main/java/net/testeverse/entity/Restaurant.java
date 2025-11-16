package net.testeverse.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "restaurants")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant {

    @Id
    private String id;

    private String restaurant_name;

    private String address;

    private String city;

    private String number;

    @JsonIgnore
    @DBRef(lazy = true)
    private User owner;
}
