package net.testeverse.repository;

import net.testeverse.entity.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;


public interface UserRepository extends MongoRepository<User, ObjectId> {
    User findUserByUsername(String username);
}
