package com.cognitivefitness.controller;

import com.cognitivefitness.dto.response.DashboardResponse;
import com.cognitivefitness.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardResponse> getStats(Authentication authentication) {
        String email = authentication.getName();
        DashboardResponse response = dashboardService.getDashboard(email);
        return ResponseEntity.ok(response);
    }
}