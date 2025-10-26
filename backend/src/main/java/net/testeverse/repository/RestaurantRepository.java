package net.testeverse.repository;

import net.testeverse.entity.Restaurant;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RestaurantRepository extends MongoRepository<Restaurant, ObjectId> {

}
