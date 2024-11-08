package me.taigavanilla.lifediary.dto;

import lombok.Data;

@Data
public class DiaryEntryResponseDTO {
  private String id;
  private String date;
  private String content;
  private long createdAt;
  private long updatedAt;
}
