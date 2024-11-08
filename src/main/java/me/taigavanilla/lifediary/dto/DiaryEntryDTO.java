package me.taigavanilla.lifediary.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DiaryEntryDTO {
  private String id;

  @NotBlank(message = "Date is required")
  @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Date must be in format YYYY-MM-DD")
  private String date;

  @Size(max = 5000, message = "Content must be at most 5000 characters long")
  private String content;

  private long createdAt;
  private long updatedAt;
}
