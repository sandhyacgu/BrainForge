import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">

                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold text-purple-400">
                        🧠 BrainForge
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition"
                    >
                        Logout
                    </button>
                </div>

                <div className="bg-gray-800 rounded-2xl p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-1">
                        Welcome back, {user?.username}! 👋
                    </h2>
                    <p className="text-gray-400">Ready for your daily brain training?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 rounded-2xl p-6 text-center">
                        <div className="text-4xl mb-2">🎯</div>
                        <h3 className="text-lg font-semibold">Daily Streak</h3>
                        <p className="text-3xl font-bold text-purple-400 mt-2">0</p>
                        <p className="text-gray-400 text-sm">days</p>
                    </div>
                    <div className="bg-gray-800 rounded-2xl p-6 text-center">
                        <div className="text-4xl mb-2">🏆</div>
                        <h3 className="text-lg font-semibold">Total Score</h3>
                        <p className="text-3xl font-bold text-purple-400 mt-2">0</p>
                        <p className="text-gray-400 text-sm">points</p>
                    </div>
                    <div className="bg-gray-800 rounded-2xl p-6 text-center">
                        <div className="text-4xl mb-2">🎮</div>
                        <h3 className="text-lg font-semibold">Games Played</h3>
                        <p className="text-3xl font-bold text-purple-400 mt-2">0</p>
                        <p className="text-gray-400 text-sm">sessions</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardPage;