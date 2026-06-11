import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ReflexRush from './pages/games/ReflexRush';
import MemorySequence from './pages/games/MemorySequence';
import PatternRecall from './pages/games/PatternRecall';
import FocusGrid from './pages/games/FocusGrid';
import ColorTrap from './pages/games/ColorTrap';
import SpotDifference from './pages/games/SpotDifference';
import TypingFocus from './pages/games/TypingFocus';
import SpeedMath from './pages/games/SpeedMath';
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return user ? children : <Navigate to="/login" />;
};

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                } />
                <Route path="/games/reflex-rush" element={
                    <ProtectedRoute>
                        <ReflexRush />
                    </ProtectedRoute>
                } />
                <Route path="/games/memory-sequence" element={
                    <ProtectedRoute>
                        <MemorySequence />
                    </ProtectedRoute>
                } />
                <Route path="/games/pattern-recall" element={
                    <ProtectedRoute>
                        <PatternRecall />
                    </ProtectedRoute>
                } />
                <Route path="/games/focus-grid" element={
                        <ProtectedRoute>
                             <FocusGrid />
                        </ProtectedRoute>
                } />
                <Route path="/games/color-trap" element={
                         <ProtectedRoute>
                             <ColorTrap />
                         </ProtectedRoute>
                } />
                <Route path="/games/spot-difference" element={
                         <ProtectedRoute>
                            <SpotDifference />
                         </ProtectedRoute>
                } />
                <Route path="/games/typing-focus" element={
                         <ProtectedRoute>
                            <TypingFocus />
                         </ProtectedRoute>
                } />
                <Route path="/games/speed-math" element={
                        <ProtectedRoute>
                           <SpeedMath />
                        </ProtectedRoute>
                } />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;