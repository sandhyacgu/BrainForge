import api from "./api";

export async function saveGameSession({ gameSlug, score, durationMs, accuracy, metadata = {} }) {
  try {
    await api.post("/api/sessions", {
      gameSlug,
      score,
      durationMs,
      accuracy,
      metadata,
    });
  } catch (err) {
    console.error("Failed to save game session", err);
  }
}