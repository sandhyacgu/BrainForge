package com.cognitivefitness.service;

import com.cognitivefitness.dto.request.SaveSessionRequest;
import com.cognitivefitness.entity.Game;
import com.cognitivefitness.entity.GameSession;
import com.cognitivefitness.entity.User;
import com.cognitivefitness.exception.ResourceNotFoundException;
import com.cognitivefitness.repository.GameRepository;
import com.cognitivefitness.repository.GameSessionRepository;
import com.cognitivefitness.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GameSessionService {

    private final GameSessionRepository gameSessionRepository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;

    public GameSession saveSession(String email, SaveSessionRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", email));

        Game game = gameRepository.findBySlug(request.getGameSlug())
                .orElseThrow(() -> new ResourceNotFoundException("Game", request.getGameSlug()));

        GameSession session = GameSession.builder()
                .user(user)
                .game(game)
                .score(request.getScore())
                .durationMs(request.getDurationMs())
                .accuracy(request.getAccuracy())
                .metadata(request.getMetadata())
                .build();

        return gameSessionRepository.save(session);
    }
}