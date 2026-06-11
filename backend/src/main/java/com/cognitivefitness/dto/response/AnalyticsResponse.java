package com.cognitivefitness.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {

    private List<ScoreHistory> scoreHistory;
    private List<GameStat> gameStats;
    private int totalSessions;
    private int totalScore;
    private double averageScore;
    private String bestGame;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScoreHistory {
        private String date;
        private int score;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GameStat {
        private String gameName;
        private int timesPlayed;
        private int bestScore;
        private double avgScore;
    }
}