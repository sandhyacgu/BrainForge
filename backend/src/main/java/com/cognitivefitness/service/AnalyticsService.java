package com.cognitivefitness.service;

import com.cognitivefitness.dto.response.AnalyticsResponse;
import com.cognitivefitness.entity.GameSession;
import com.cognitivefitness.entity.User;
import com.cognitivefitness.exception.ResourceNotFoundException;
import com.cognitivefitness.repository.GameSessionRepository;
import com.cognitivefitness.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final GameSessionRepository gameSessionRepository;
    private final UserRepository userRepository;

    public AnalyticsResponse getAnalytics(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", email));

        List<GameSession> sessions = gameSessionRepository
                .findByUserIdOrderByPlayedAtDesc(user.getId());

        if (sessions.isEmpty()) {
            return AnalyticsResponse.builder()
                    .scoreHistory(new ArrayList<>())
                    .gameStats(new ArrayList<>())
                    .totalSessions(0)
                    .totalScore(0)
                    .averageScore(0)
                    .bestGame("N/A")
                    .build();
        }

        // Score history — last 10 sessions
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");
        List<AnalyticsResponse.ScoreHistory> scoreHistory = sessions.stream()
                .limit(10)
                .sorted(Comparator.comparing(GameSession::getPlayedAt))
                .map(gs -> AnalyticsResponse.ScoreHistory.builder()
                        .date(gs.getPlayedAt().format(formatter))
                        .score(gs.getScore())
                        .build())
                .collect(Collectors.toList());

        // Game stats — group by game
        Map<String, List<GameSession>> byGame = sessions.stream()
                .collect(Collectors.groupingBy(gs -> gs.getGame().getName()));

        List<AnalyticsResponse.GameStat> gameStats = byGame.entrySet().stream()
                .map(entry -> {
                    List<GameSession> gameSessions = entry.getValue();
                    int best = gameSessions.stream().mapToInt(GameSession::getScore).max().orElse(0);
                    double avg = gameSessions.stream().mapToInt(GameSession::getScore).average().orElse(0);
                    return AnalyticsResponse.GameStat.builder()
                            .gameName(entry.getKey())
                            .timesPlayed(gameSessions.size())
                            .bestScore(best)
                            .avgScore(Math.round(avg * 10.0) / 10.0)
                            .build();
                })
                .sorted(Comparator.comparingInt(AnalyticsResponse.GameStat::getBestScore).reversed())
                .collect(Collectors.toList());

        // Best game
        String bestGame = gameStats.isEmpty() ? "N/A" : gameStats.get(0).getGameName();

        // Totals
        int totalScore = sessions.stream().mapToInt(GameSession::getScore).sum();
        double avgScore = sessions.stream().mapToInt(GameSession::getScore).average().orElse(0);

        return AnalyticsResponse.builder()
                .scoreHistory(scoreHistory)
                .gameStats(gameStats)
                .totalSessions(sessions.size())
                .totalScore(totalScore)
                .averageScore(Math.round(avgScore * 10.0) / 10.0)
                .bestGame(bestGame)
                .build();
    }
}