package net.testeverse.repository;

import net.testeverse.entity.Product;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductRepositoryImpl {

    @Autowired
    private MongoTemplate mongoTemplate;

    public boolean deleteProductByPublicId(String publicId) {
        try {
            Query query = new Query();
            query.addCriteria(Criteria.where("publicId").is(publicId));
            mongoTemplate.remove(query, Product.class);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Product getProductById(String id) {
        try {
            Product product = mongoTemplate.findById(id, Product.class);
            return product;
        } catch (Exception e) {
            return null;
        }
    }
}
