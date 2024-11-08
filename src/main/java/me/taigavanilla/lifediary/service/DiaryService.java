package me.taigavanilla.lifediary.service;

import java.util.List;
import me.taigavanilla.lifediary.model.DiaryEntry;
import me.taigavanilla.lifediary.repository.DiaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
public class DiaryService {

  @Autowired private DiaryRepository diaryRepository;

  @Autowired private MongoTemplate mongoTemplate;

  public DiaryEntry saveDiaryEntry(DiaryEntry entry) {
    if (entry.getContent() == null || entry.getContent().trim().isEmpty()) {
      deleteDiaryEntry(entry.getDate(), entry.getUserId());
      return null;
    }

    long currentTime = System.currentTimeMillis();

    Query query =
        new Query(Criteria.where("date").is(entry.getDate()).and("userId").is(entry.getUserId()));

    Update update =
        new Update()
            .set("content", entry.getContent())
            .set("updatedAt", currentTime)
            .setOnInsert("createdAt", currentTime);

    mongoTemplate.upsert(query, update, DiaryEntry.class);

    // Return the updated/inserted document
    return diaryRepository.findByDateAndUserId(entry.getDate(), entry.getUserId());
  }

  public void deleteDiaryEntry(String date, String userId) {
    DiaryEntry entry = diaryRepository.findByDateAndUserId(date, userId);
    if (entry != null) {
      diaryRepository.delete(entry);
    }
  }

  public DiaryEntry getDiaryEntry(String date, String userId) {
    return diaryRepository.findByDateAndUserId(date, userId);
  }

  public List<DiaryEntry> getEntriesForMonth(String year, String month, String userId) {
    String yearMonth = String.format("%s-%s", year, month);
    return diaryRepository.findByDateStartingWithAndUserId(yearMonth, userId);
  }

  public List<DiaryEntry> extractDiaryEntries(
      String startDate, String endDate, boolean all, String userId) {
    if (all) {
      return diaryRepository.findAllByUserIdOrderByDateAsc(userId);
    }
    return diaryRepository.findByDateBetweenAndUserIdOrderByDateAsc(startDate, endDate, userId);
  }
}
