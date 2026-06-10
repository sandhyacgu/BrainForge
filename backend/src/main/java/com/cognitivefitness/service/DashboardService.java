package com.cognitivefitness.service;

import com.cognitivefitness.dto.response.DashboardResponse;
import com.cognitivefitness.entity.GameSession;
import com.cognitivefitness.entity.User;
import com.cognitivefitness.exception.ResourceNotFoundException;
import com.cognitivefitness.repository.GameSessionRepository;
import com.cognitivefitness.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final GameSessionRepository gameSessionRepository;
    private final UserRepository userRepository;

    public DashboardResponse getDashboard(String email) {

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User", email));

        String userId = user.getId();

        long totalSessions = gameSessionRepository.countByUserId(userId);
        int totalScore = gameSessionRepository.getTotalScoreByUserId(userId);
        double averageScore = gameSessionRepository.getAverageScoreByUserId(userId);
        double averageAccuracy = gameSessionRepository.getAverageAccuracyByUserId(userId);

        List<GameSession> recent = gameSessionRepository
                .findTop5ByUserId(userId, PageRequest.of(0, 5));

        List<DashboardResponse.RecentActivity> recentActivity = recent.stream()
                .map(gs -> DashboardResponse.RecentActivity.builder()
                        .gameName(gs.getGame().getName())
                        .score(gs.getScore())
                        .accuracy(gs.getAccuracy())
                        .playedAt(gs.getPlayedAt())
                        .build())
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .username(user.getUsername())
                .totalSessions((int) totalSessions)
                .totalScore(totalScore)
                .averageScore(Math.round(averageScore * 10.0) / 10.0)
                .averageAccuracy(Math.round(averageAccuracy * 10.0) / 10.0)
                .currentStreak(0) // Phase 10 will calculate real streak
                .recentActivity(recentActivity)
                .build();
    }
}