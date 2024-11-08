package me.taigavanilla.lifediary.service;

import com.mongodb.DuplicateKeyException;
import me.taigavanilla.lifediary.dto.AuthRegisterDTO;
import me.taigavanilla.lifediary.dto.AuthResponseDTO;
import me.taigavanilla.lifediary.dto.UserDTO;
import me.taigavanilla.lifediary.mapper.DiaryMapper;
import me.taigavanilla.lifediary.model.User;
import me.taigavanilla.lifediary.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

  @Autowired private UserRepository userRepository;

  @Autowired private BCryptPasswordEncoder passwordEncoder;

  @Autowired private DiaryMapper mapper;

  @Transactional
  public AuthResponseDTO register(AuthRegisterDTO registerDTO) {
    try {
      if (userRepository.findByUsername(registerDTO.getUsername()).isPresent()) {
        return AuthResponseDTO.error("Username already exists");
      }

      User user = mapper.toEntity(registerDTO);
      user.setPassword(passwordEncoder.encode(user.getPassword()));

      userRepository.save(user);
      return AuthResponseDTO.success("User registered successfully");

    } catch (DuplicateKeyException e) {
      return AuthResponseDTO.error("Username already exists");
    } catch (Exception e) {
      return AuthResponseDTO.error("An unexpected error occurred during registration");
    }
  }

  public UserDTO getCurrentUser(String username) {
    return userRepository.findByUsername(username).map(mapper::toDTO).orElse(null);
  }

  public boolean isAuthenticated(String username) {
    return username != null
        && !username.equals("anonymousUser")
        && userRepository.findByUsername(username).isPresent();
  }
}
