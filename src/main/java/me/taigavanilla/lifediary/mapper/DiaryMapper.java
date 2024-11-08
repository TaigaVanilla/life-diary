package me.taigavanilla.lifediary.mapper;

import me.taigavanilla.lifediary.dto.*;
import me.taigavanilla.lifediary.model.*;
import org.springframework.stereotype.Component;

@Component
public class DiaryMapper {

  public DiaryEntry toEntity(DiaryEntryCreateDTO dto) {
    DiaryEntry entity = new DiaryEntry();
    entity.setDate(dto.getDate());
    entity.setContent(dto.getContent());
    return entity;
  }

  public DiaryEntryResponseDTO toResponseDTO(DiaryEntry entity) {
    DiaryEntryResponseDTO dto = new DiaryEntryResponseDTO();
    dto.setId(entity.getId());
    dto.setDate(entity.getDate());
    dto.setContent(entity.getContent());
    dto.setCreatedAt(entity.getCreatedAt());
    dto.setUpdatedAt(entity.getUpdatedAt());
    return dto;
  }

  public User toEntity(AuthRegisterDTO dto) {
    User entity = new User();
    entity.setUsername(dto.getUsername());
    entity.setPassword(dto.getPassword());
    return entity;
  }

  public UserDTO toDTO(User entity) {
    UserDTO dto = new UserDTO();
    dto.setId(entity.getId());
    dto.setUsername(entity.getUsername());
    return dto;
  }
}
