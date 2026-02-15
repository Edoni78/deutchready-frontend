import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProgress } from '../api/user';

const navItems = [
  { path: '/learn', label: 'Learn', icon: '📖' },
  { path: '/exercises', label: 'Exercises', icon: '✏️' },
  { path: '/courses', label: 'Courses', icon: '📚' },
  { path: '/my-dashboard', label: 'My Stats', icon: '📊' },
  { path: '/interview', label: 'Interview', icon: '🎤' },
  { path: '/dialogue', label: 'Dialogue', icon: '💬' },
];

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState({ xp: 0, level: 1, nextLevelXp: 100 });

  useEffect(() => {
    getProgress()
      .then((res) => setProgress(res.data))
      .catch(() => {});
  }, [location.pathname]);

  const xpProgress = progress.nextLevelXp > 0
    ? Math.min(100, (progress.xp / progress.nextLevelXp) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2 text-stone-800 hover:text-brand-600 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-soft">
                <span className="text-sm font-bold text-white">D</span>
              </div>
              <span className="font-bold">DeutchReady</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-brand-100 text-brand-700'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100">
                <span className="text-xs font-medium text-stone-500">Lv {progress.level}</span>
                <div className="w-16 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                <span className="text-xs text-stone-400">{progress.xp} XP</span>
              </div>
              <span className="text-sm text-stone-500 hidden sm:inline truncate max-w-[120px]">
                {user?.username || user?.email}
              </span>
              {user?.role === 'superadmin' && (
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-warm-600 hover:text-warm-700"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="text-sm text-stone-500 hover:text-stone-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden overflow-x-auto border-t border-stone-100">
          <div className="flex gap-1 px-2 py-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`shrink-0 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  location.pathname === item.path
                    ? 'bg-brand-100 text-brand-700'
                    : 'text-stone-600 bg-stone-50'
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
