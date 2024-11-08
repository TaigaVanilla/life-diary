package me.taigavanilla.lifediary.controller;

import jakarta.validation.Valid;
import me.taigavanilla.lifediary.dto.AuthRegisterDTO;
import me.taigavanilla.lifediary.dto.AuthResponseDTO;
import me.taigavanilla.lifediary.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

  @Autowired private AuthService authService;

  @PostMapping("/register")
  public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody AuthRegisterDTO registerDTO) {
    try {
      AuthResponseDTO response = authService.register(registerDTO);
      return response.isSuccess()
              ? ResponseEntity.ok(response)
              : ResponseEntity.badRequest().body(response);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body(AuthResponseDTO.error("An unexpected error occurred"));
    }
  }

  @GetMapping("/check")
  public ResponseEntity<AuthResponseDTO> checkAuthentication(Authentication authentication) {
    if (authentication != null && authService.isAuthenticated(authentication.getName())) {
      return ResponseEntity.ok(AuthResponseDTO.success("Authenticated"));
    } else {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(AuthResponseDTO.error("Not authenticated"));
    }
  }
}
