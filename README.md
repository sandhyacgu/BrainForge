# 🧠 BrainForge

**A fun, game-based brain training app** that helps people improve their memory, focus, attention, reaction speed, and problem-solving — through short, daily games.

🔗 **Try it live:** [brain-forge-sandhyacgus-projects.vercel.app](https://brain-forge-sandhyacgus-projects.vercel.app)
🔗 **Backend (API):** [brainforge-backend-wj2h.onrender.com](https://brainforge-backend-wj2h.onrender.com)

> ⚡ Note: The first time you open the live app, it may take 30–50 seconds to load. This is because the free hosting service "wakes up" the server only when someone visits — totally normal, just give it a moment!

---

## 💡 What This Project Is

BrainForge is like a gym for your brain — but instead of weights, you play short games that train different mental skills (memory, focus, speed, attention, etc.).

I built this as a complete, real-world application — not just a single game, but a full product with:
- User accounts (sign up / log in)
- 10 different brain games
- A dashboard that tracks your progress
- Charts showing how you're improving over time
- A leaderboard to compare scores with others

It's also fully **deployed online**, meaning anyone can use it right now from the link above — it's not just running on my laptop.

---

## 📸 What It Looks Like

| Dashboard | Playing a Game | Your Progress |
|---|---|---|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Gameplay](docs/screenshots/gameplay.png) | ![Analytics](docs/screenshots/analytics.png) |

| Leaderboard | Login Page |
|---|---|
| ![Leaderboard](docs/screenshots/leaderboard.png) | ![Login](docs/screenshots/login.png) |

> 📌 *To add your own screenshots, see [Adding Screenshots](#-adding-screenshots) below.*

---

## ✨ What You Can Do in the App

- 🔐 **Create an account** and log in securely
- 📊 **See your dashboard** — your stats, recent games, and quick links to play
- 🎮 **Play 10 different brain games**, each training a different skill:

  | Game | What It Trains |
  |---|---|
  | ⚡ Reflex Rush | How fast you react |
  | 🧠 Memory Sequence | Remembering things in order |
  | 🎯 Pattern Recall | Visual memory |
  | 🔲 Focus Grid | Staying focused |
  | 🎨 Color Trap | Quick thinking / mental flexibility |
  | 🔍 Spot Difference | Observation skills |
  | ⌨️ Typing Focus | Speed and accuracy |
  | 🔢 Speed Math | Quick mental math |
  | 📅 Daily Challenge | A new puzzle every day |
  | 👑 Cognitive Boss Mode | A mix of everything — the ultimate test |

- 📈 **Track your progress** — see charts of your scores over time, and which games you're best at
- 🏆 **Check the leaderboard** — see how your total score compares to other players

---

## ⚙️ How It's Built

A quick summary of the technical decisions in this project:

- **Frontend**: Built with **React 19 + Vite** and **Tailwind CSS**, hosted on **Vercel**
- **Backend**: Built with **Java 21 + Spring Boot 3.2.5**, hosted on **Render**
- **Database**: **PostgreSQL**, hosted on **Neon** (serverless Postgres)
- **Stateless JWT authentication** with Spring Security — custom filter chain, BCrypt password hashing, route-level authorization
- **Layered backend architecture** — clean separation across controller / service / repository / DTO / entity layers
- **Cross-origin deployment** — frontend and backend live on different domains, with CORS configured for production
- **Dockerized backend** — multi-stage Dockerfile (Maven build stage → slim JRE runtime stage) for a lean production image
- **Auto-deployment (CI on push)** — both frontend and backend redeploy automatically from `main` via GitHub integration
- **Environment-driven config** — DB credentials, JWT secret, and API URL are all set via environment variables, never hardcoded
- **Data visualization** — score history and per-game stats rendered with Recharts, using data calculated on the backend
- **Automated testing** — core login and dashboard logic covered by JUnit 5 + Mockito tests

---

## 🏗️ How the Pieces Fit Together

```
┌──────────────┐                          ┌──────────────────┐                    ┌──────────────┐
│   Frontend    │ ───────────────────────▶ │     Backend       │ ─────────────────▶ │   Database    │
│ (what you see)│                          │  (the logic)      │                    │ (the storage) │
│  React + Vite │ ◀─────────────────────── │  Spring Boot API  │ ◀───────────────── │   PostgreSQL  │
│   on Vercel   │      sends data back     │     on Render     │   sends data back  │   on Neon     │
└──────────────┘                          └──────────────────┘                    └──────────────┘
```

### Folder Structure

```
brainforge/
│
├── frontend/                          # The website (React + Vite + Tailwind)
│   ├── public/                        # Static files (icons, etc.)
│   ├── src/
│   │   ├── assets/                    # Images used in the app
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx        # Tracks whether the user is logged in
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.jsx      # Login screen
│   │   │   │   └── RegisterPage.jsx   # Sign-up screen
│   │   │   ├── dashboard/
│   │   │   │   └── DashboardPage.jsx  # Main dashboard with stats & game cards
│   │   │   ├── games/
│   │   │   │   ├── ReflexRush.jsx
│   │   │   │   ├── MemorySequence.jsx
│   │   │   │   ├── PatternRecall.jsx
│   │   │   │   ├── FocusGrid.jsx
│   │   │   │   ├── ColorTrap.jsx
│   │   │   │   ├── SpotDifference.jsx
│   │   │   │   ├── TypingFocus.jsx
│   │   │   │   ├── SpeedMath.jsx
│   │   │   │   ├── DailyChallenge.jsx
│   │   │   │   └── BossMode.jsx       # All 10 games, one file each
│   │   │   ├── analytics/
│   │   │   │   └── AnalyticsPage.jsx  # Charts and per-game performance
│   │   │   └── leaderboard/
│   │   │       └── LeaderboardPage.jsx # Global rankings
│   │   ├── services/
│   │   │   ├── api.js                 # Sets up requests to the backend
│   │   │   ├── authService.js         # Login/register/logout helpers
│   │   │   └── sessionService.js      # Saves game results to the backend
│   │   ├── App.jsx                    # All page routes
│   │   └── main.jsx                   # App entry point
│   ├── .env                           # Local environment settings
│   ├── package.json
│   └── vite.config.js
│
└── backend/                           # The server (Spring Boot)
    ├── src/main/java/com/cognitivefitness/
    │   ├── config/
    │   │   ├── SecurityConfig.java    # Login/security rules
    │   │   └── CorsConfig.java        # Allows the frontend to talk to this backend
    │   ├── controller/
    │   │   ├── AuthController.java         # Register & login
    │   │   ├── DashboardController.java    # Dashboard stats
    │   │   ├── GameSessionController.java  # Save game results
    │   │   ├── AnalyticsController.java    # Charts data
    │   │   └── LeaderboardController.java  # Rankings
    │   ├── service/
    │   │   ├── AuthService.java
    │   │   ├── DashboardService.java
    │   │   ├── GameSessionService.java
    │   │   ├── AnalyticsService.java
    │   │   └── LeaderboardService.java     # Business logic for each feature
    │   ├── repository/
    │   │   ├── UserRepository.java
    │   │   ├── GameRepository.java
    │   │   ├── GameSessionRepository.java
    │   │   ├── LeaderboardRepository.java
    │   │   ├── AchievementRepository.java
    │   │   └── DailyChallengeRepository.java  # Talk to the database
    │   ├── entity/
    │   │   ├── User.java
    │   │   ├── Game.java
    │   │   ├── GameSession.java
    │   │   ├── LeaderboardEntry.java
    │   │   ├── Achievement.java
    │   │   └── DailyChallenge.java        # Database table definitions
    │   ├── dto/
    │   │   ├── request/                   # Data the frontend sends in
    │   │   │   ├── LoginRequest.java
    │   │   │   ├── RegisterRequest.java
    │   │   │   └── SaveSessionRequest.java
    │   │   └── response/                  # Data sent back to the frontend
    │   │       ├── AuthResponse.java
    │   │       ├── DashboardResponse.java
    │   │       ├── AnalyticsResponse.java
    │   │       └── LeaderboardResponse.java
    │   ├── security/
    │   │   ├── jwt/
    │   │   │   └── JwtProvider.java       # Creates & checks login tokens
    │   │   └── filter/
    │   │       └── JwtAuthFilter.java     # Checks every request for a valid token
    │   ├── exception/
    │   │   ├── ApiException.java
    │   │   ├── GlobalExceptionHandler.java
    │   │   └── ResourceNotFoundException.java  # Error handling
    │   └── CognitiveFitnessApplication.java     # App entry point
    ├── src/test/java/com/cognitivefitness/
    │   └── service/
    │       ├── AuthServiceTest.java       # Tests for login/register
    │       └── DashboardServiceTest.java  # Tests for dashboard stats
    ├── src/main/resources/
    │   └── application.yml                # App configuration
    ├── Dockerfile                          # How to build the backend for deployment
    └── pom.xml                             # Java project dependencies
```

---

## 🔑 Main Backend Endpoints (API)

| Method | Endpoint | What It Does |
|---|---|---|
| `POST` | `/api/auth/register` | Create a new account |
| `POST` | `/api/auth/login` | Log in and get a security token |
| `GET` | `/api/dashboard/stats` | Get your dashboard stats |
| `POST` | `/api/sessions` | Save the result of a finished game |
| `GET` | `/api/analytics` | Get your score history and game stats |
| `GET` | `/api/leaderboard` | Get the global rankings |

Everything except register/login requires you to be logged in (a valid security token).

---

## 🚀 Running This Project on Your Own Computer

### What You'll Need
- Java 21
- Maven
- Node.js 20+
- PostgreSQL

### Step 1 — Start the Backend

```bash
cd backend
mvn clean spring-boot:run
```

This starts the server at `http://localhost:8080`

### Step 2 — Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

This starts the website at `http://localhost:5173`

### Settings You'll Need

**Backend** (`application.yml`)
```yaml
POSTGRES_URL=jdbc:postgresql://localhost:5432/cognitive_fitness
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

**Frontend** (`.env`)
```
VITE_API_URL=http://localhost:8080
```

---

## 🧪 Running the Tests

```bash
cd backend
mvn test
```

These automated tests check that login/registration work correctly (including things like "what happens if someone tries to register with an email that's already used") and that the dashboard correctly calculates a user's stats.

The 10 games themselves run in the browser and have been tested by playing through each one manually. Adding automated tests for the games and analytics is on the to-do list below.

---

## 📌 What's Next (To-Do List)

- [ ] Add automated tests for saving game results and analytics
- [ ] Look into adding Redis (a caching tool) for the leaderboard if the app grows and needs to handle more users — not needed yet at this size
- [ ] Real-time multiplayer leaderboard (live updates as people play)
- [ ] Daily streaks and reminders
- [ ] Better mobile phone experience

---

## 🖼️ Adding Screenshots

Want the preview images above to show up? Here's how:

1. Create a folder called `docs/screenshots/` in this project
2. Take screenshots and save them with these exact names: `dashboard.png`, `gameplay.png`, `analytics.png`, `leaderboard.png`, `login.png`
3. Push the changes — the images will appear automatically in this README

---

## 👩‍💻 About Me

**Sandhya** — [GitHub](https://github.com/sandhyacgu)

I built this project to practice and demonstrate full-stack development — designing the database, building a secure backend, creating an interactive frontend, and deploying everything live for anyone to use.

---

## 📄 License

 [MIT License](LICENSE).
