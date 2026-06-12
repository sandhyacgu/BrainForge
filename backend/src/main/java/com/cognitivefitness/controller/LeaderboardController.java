package com.cognitivefitness.controller;

import com.cognitivefitness.dto.response.LeaderboardResponse;
import com.cognitivefitness.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping
    public ResponseEntity<LeaderboardResponse> getLeaderboard(Authentication authentication) {
        String email = authentication.getName();
        LeaderboardResponse response = leaderboardService.getLeaderboard(email);
        return ResponseEntity.ok(response);
    }
}