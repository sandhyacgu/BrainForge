package com.cognitivefitness.repository;

import com.cognitivefitness.entity.GameSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameSessionRepository extends JpaRepository<GameSession, String> {

    List<GameSession> findByUserIdOrderByPlayedAtDesc(String userId);

    @Query("SELECT gs FROM GameSession gs WHERE gs.user.id = :userId ORDER BY gs.playedAt DESC")
    List<GameSession> findTop5ByUserId(@Param("userId") String userId,
                                       org.springframework.data.domain.Pageable pageable);

    @Query("SELECT COALESCE(SUM(gs.score), 0) FROM GameSession gs WHERE gs.user.id = :userId")
    int getTotalScoreByUserId(@Param("userId") String userId);

    @Query("SELECT COALESCE(AVG(gs.score), 0) FROM GameSession gs WHERE gs.user.id = :userId")
    double getAverageScoreByUserId(@Param("userId") String userId);

    @Query("SELECT COALESCE(AVG(gs.accuracy), 0) FROM GameSession gs WHERE gs.user.id = :userId")
    double getAverageAccuracyByUserId(@Param("userId") String userId);

    long countByUserId(String userId);
}