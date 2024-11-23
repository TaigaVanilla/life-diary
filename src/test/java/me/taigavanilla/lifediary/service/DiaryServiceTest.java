package me.taigavanilla.lifediary.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Collections;
import java.util.List;
import me.taigavanilla.lifediary.model.DiaryEntry;
import me.taigavanilla.lifediary.repository.DiaryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

@ExtendWith(MockitoExtension.class)
public class DiaryServiceTest {

    @Mock
    private DiaryRepository diaryRepository;

    @Mock
    private MongoTemplate mongoTemplate;

    @InjectMocks
    private DiaryService diaryService;

    @Test
    void testSaveDiaryEntry() {
        DiaryEntry diaryEntry = new DiaryEntry();
        diaryEntry.setUserId("user123");
        diaryEntry.setDate("2025-01-01");
        diaryEntry.setContent("Test content");

        when(diaryRepository.findByDateAndUserId(diaryEntry.getDate(), diaryEntry.getUserId()))
                .thenReturn(diaryEntry);

        DiaryEntry savedEntry = diaryService.saveDiaryEntry(diaryEntry);

        assertNotNull(savedEntry);
        assertEquals("Test content", savedEntry.getContent());
        verify(mongoTemplate, times(1)).upsert(any(Query.class), any(Update.class), eq(DiaryEntry.class));
    }

    @Test
    void testDeleteDiaryEntry() {
        DiaryEntry diaryEntry = new DiaryEntry();
        diaryEntry.setUserId("user123");
        diaryEntry.setDate("2025-01-20");

        when(diaryRepository.findByDateAndUserId(diaryEntry.getDate(), diaryEntry.getUserId()))
                .thenReturn(diaryEntry);

        diaryService.deleteDiaryEntry(diaryEntry.getDate(), diaryEntry.getUserId());

        verify(diaryRepository, times(1)).delete(diaryEntry);
    }

    @Test
    void testGetEntriesForMonth() {
        DiaryEntry diaryEntry = new DiaryEntry();
        diaryEntry.setUserId("user123");
        diaryEntry.setDate("2025-01-01");

        when(diaryRepository.findByDateStartingWithAndUserId("2025-01", "user123"))
                .thenReturn(Collections.singletonList(diaryEntry));

        List<DiaryEntry> entries = diaryService.getEntriesForMonth("2025", "01", "user123");

        assertEquals(1, entries.size());
        assertEquals("2025-01-01", entries.get(0).getDate());
    }
}
