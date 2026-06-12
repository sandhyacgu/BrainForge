package com.cognitivefitness.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaveSessionRequest {
    private String gameSlug;
    private int score;
    private int durationMs;
    private float accuracy;
    private Map<String, Object> metadata;
}