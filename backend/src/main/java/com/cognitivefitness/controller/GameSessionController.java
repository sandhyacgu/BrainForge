package com.cognitivefitness.controller;

import com.cognitivefitness.dto.request.SaveSessionRequest;
import com.cognitivefitness.entity.GameSession;
import com.cognitivefitness.service.GameSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class GameSessionController {

    private final GameSessionService gameSessionService;

    @PostMapping
    public ResponseEntity<GameSession> saveSession(
            Authentication authentication,
            @RequestBody SaveSessionRequest request) {

        String email = authentication.getName();
        GameSession session = gameSessionService.saveSession(email, request);
        return ResponseEntity.ok(session);
    }
}