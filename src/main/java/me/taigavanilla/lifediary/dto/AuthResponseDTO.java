package me.taigavanilla.lifediary.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponseDTO {
  private String message;
  private boolean success;

  public static AuthResponseDTO success(String message) {
    return AuthResponseDTO.builder().message(message).success(true).build();
  }

  public static AuthResponseDTO error(String message) {
    return AuthResponseDTO.builder().message(message).success(false).build();
  }
}
