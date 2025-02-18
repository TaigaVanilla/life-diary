package me.taigavanilla.lifediary.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import java.util.List;
import java.util.stream.Collectors;
import me.taigavanilla.lifediary.dto.DiaryEntryCreateDTO;
import me.taigavanilla.lifediary.dto.DiaryEntryResponseDTO;
import me.taigavanilla.lifediary.mapper.DiaryMapper;
import me.taigavanilla.lifediary.model.DiaryEntry;
import me.taigavanilla.lifediary.service.DiaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diary")
@Validated
public class DiaryController {

  @Autowired private DiaryService diaryService;

  @Autowired private DiaryMapper diaryMapper;

  @PostMapping
  public ResponseEntity<DiaryEntryResponseDTO> saveDiaryEntry(
      @Valid @RequestBody DiaryEntryCreateDTO entryDTO, Authentication authentication) {

    DiaryEntry entry = diaryMapper.toEntity(entryDTO);
    entry.setUserId(authentication.getName());

    DiaryEntry savedEntry = diaryService.saveDiaryEntry(entry);
    if (savedEntry == null) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(diaryMapper.toResponseDTO(savedEntry));
  }

  @GetMapping("/{date}")
  public ResponseEntity<DiaryEntryResponseDTO> getDiaryEntry(
      @PathVariable String date, Authentication authentication) {

    DiaryEntry entry = diaryService.getDiaryEntry(date, authentication.getName());
    return entry != null
        ? ResponseEntity.ok(diaryMapper.toResponseDTO(entry))
        : ResponseEntity.noContent().build();
  }

  @GetMapping("/month/{year}/{month}")
  public ResponseEntity<List<DiaryEntryResponseDTO>> getEntriesForMonth(
      @PathVariable @Pattern(regexp = "\\d{4}") String year,
      @PathVariable @Pattern(regexp = "^(0?[1-9]|1[0-2])$") String month,
      Authentication authentication) {

    List<DiaryEntryResponseDTO> entries =
        diaryService.getEntriesForMonth(year, month, authentication.getName()).stream()
            .map(diaryMapper::toResponseDTO)
            .collect(Collectors.toList());

    return ResponseEntity.ok(entries);
  }

  @GetMapping("/extract")
  public ResponseEntity<List<DiaryEntryResponseDTO>> extractDiaryEntries(
      @RequestParam(required = false) String startDate,
      @RequestParam(required = false) String endDate,
      @RequestParam(required = false, defaultValue = "false") boolean all,
      Authentication authentication) {

    if (!all && (startDate == null || endDate == null)) {
      return ResponseEntity.badRequest().build();
    }

    List<DiaryEntryResponseDTO> entries =
        diaryService.extractDiaryEntries(startDate, endDate, all, authentication.getName()).stream()
            .map(diaryMapper::toResponseDTO)
            .collect(Collectors.toList());

    return ResponseEntity.ok(entries);
  }
}
