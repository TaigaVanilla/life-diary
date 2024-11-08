package me.taigavanilla.lifediary.repository;

import java.util.Optional;
import me.taigavanilla.lifediary.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
  Optional<User> findByUsername(String username);
}
