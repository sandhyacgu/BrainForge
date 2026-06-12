package com.cognitivefitness.service;

import com.cognitivefitness.dto.response.LeaderboardResponse;
import com.cognitivefitness.entity.User;
import com.cognitivefitness.exception.ResourceNotFoundException;
import com.cognitivefitness.repository.GameSessionRepository;
import com.cognitivefitness.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final GameSessionRepository gameSessionRepository;
    private final UserRepository userRepository;

    public LeaderboardResponse getLeaderboard(String email) {

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", email));

        List<User> allUsers = userRepository.findAll();

        List<LeaderboardResponse.LeaderboardEntry> entries = new ArrayList<>();

        for (User user : allUsers) {
            long sessions = gameSessionRepository.countByUserId(user.getId());
            if (sessions == 0) continue;

            int totalScore = gameSessionRepository.getTotalScoreByUserId(user.getId());
            double avgScore = gameSessionRepository.getAverageScoreByUserId(user.getId());

            entries.add(LeaderboardResponse.LeaderboardEntry.builder()
                    .username(user.getUsername())
                    .totalScore(totalScore)
                    .totalSessions((int) sessions)
                    .avgScore(Math.round(avgScore * 10.0) / 10.0)
                    .rank(0)
                    .build());
        }

        // Sort by total score
        entries.sort(Comparator.comparingInt(LeaderboardResponse.LeaderboardEntry::getTotalScore).reversed());

        // Assign ranks
        for (int i = 0; i < entries.size(); i++) {
            entries.get(i).setRank(i + 1);
        }

        // Current user rank
        int currentUserRank = entries.stream()
                .filter(e -> e.getUsername().equals(currentUser.getUsername()))
                .findFirst()
                .map(LeaderboardResponse.LeaderboardEntry::getRank)
                .orElse(0);

        int currentUserScore = gameSessionRepository.getTotalScoreByUserId(currentUser.getId());

        // Top 10 only
        List<LeaderboardResponse.LeaderboardEntry> top10 = entries.stream()
                .limit(10)
                .collect(Collectors.toList());

        return LeaderboardResponse.builder()
                .entries(top10)
                .currentUserRank(currentUserRank)
                .currentUserScore(currentUserScore)
                .build();
    }
}