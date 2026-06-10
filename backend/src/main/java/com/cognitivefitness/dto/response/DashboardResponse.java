package com.cognitivefitness.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private String username;
    private int totalSessions;
    private int totalScore;
    private double averageScore;
    private double averageAccuracy;
    private int currentStreak;
    private List<RecentActivity> recentActivity;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivity {
        private String gameName;
        private int score;
        private float accuracy;
        private LocalDateTime playedAt;
    }
}