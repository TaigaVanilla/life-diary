package me.taigavanilla.lifediary.repository;

import java.util.List;
import me.taigavanilla.lifediary.model.DiaryEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface DiaryRepository extends MongoRepository<DiaryEntry, String> {
  DiaryEntry findByDateAndUserId(String date, String userId);

  List<DiaryEntry> findByDateStartingWithAndUserId(String yearMonth, String userId);

  @Query(value = "{ 'date' : { $gte: ?0, $lte: ?1 }, 'userId': ?2 }", sort = "{ 'date' : 1 }")
  List<DiaryEntry> findByDateBetweenAndUserIdOrderByDateAsc(
      String startDate, String endDate, String userId);

  List<DiaryEntry> findAllByUserIdOrderByDateAsc(String userId);
}
