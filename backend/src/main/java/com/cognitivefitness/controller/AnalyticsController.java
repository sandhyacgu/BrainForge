package com.cognitivefitness.controller;

import com.cognitivefitness.dto.response.AnalyticsResponse;
import com.cognitivefitness.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    public ResponseEntity<AnalyticsResponse> getAnalytics(Authentication authentication) {
        String email = authentication.getName();
        AnalyticsResponse response = analyticsService.getAnalytics(email);
        return ResponseEntity.ok(response);
    }
}