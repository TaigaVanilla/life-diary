package me.taigavanilla.lifediary.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "diary_entries")
public class DiaryEntry {
  @Id private String id;
  private String userId;
  private String date;
  private String content;
  private long createdAt;
  private long updatedAt;
}
