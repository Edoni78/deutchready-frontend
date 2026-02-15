import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Decorative background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cream-50 via-white to-brand-50/30" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] -translate-y-1/2 translate-x-1/2 rounded-full bg-brand-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] translate-y-1/2 -translate-x-1/2 rounded-full bg-warm-100/50 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand-50/20 blur-3xl" />
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16">
        {/* Logo mark */}
        <div className="mb-8 flex items-center justify-center gap-3 animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-brand-600 shadow-glow flex items-center justify-center">
            <span className="text-2xl font-bold text-white">D</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-800 tracking-tight">
            Deutch<span className="text-brand-600">Ready</span>
          </h1>
        </div>

        <p className="text-xl text-stone-500 mb-12 max-w-md text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Master German vocabulary, one word at a time
        </p>

        {user ? (
          <div className="card p-8 max-w-2xl w-full animate-slide-up">
            <p className="text-stone-600 text-center mb-6">
              Welcome back, <span className="font-semibold text-stone-800">{user.username || user.email}</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <Link to="/learn" className="p-4 rounded-xl bg-brand-50 border-2 border-brand-100 text-center hover:border-brand-300 transition-colors">
                <span className="text-2xl block mb-2">📖</span>
                <span className="font-medium text-stone-800">Learn</span>
              </Link>
              <Link to="/exercises" className="p-4 rounded-xl bg-brand-50 border-2 border-brand-100 text-center hover:border-brand-300 transition-colors">
                <span className="text-2xl block mb-2">✏️</span>
                <span className="font-medium text-stone-800">Exercises</span>
              </Link>
              <Link to="/courses" className="p-4 rounded-xl bg-brand-50 border-2 border-brand-100 text-center hover:border-brand-300 transition-colors">
                <span className="text-2xl block mb-2">📚</span>
                <span className="font-medium text-stone-800">Courses</span>
              </Link>
              <Link to="/my-dashboard" className="p-4 rounded-xl bg-brand-50 border-2 border-brand-100 text-center hover:border-brand-300 transition-colors">
                <span className="text-2xl block mb-2">📊</span>
                <span className="font-medium text-stone-800">My Stats</span>
              </Link>
              <Link to="/interview" className="p-4 rounded-xl bg-brand-50 border-2 border-brand-100 text-center hover:border-brand-300 transition-colors">
                <span className="text-2xl block mb-2">🎤</span>
                <span className="font-medium text-stone-800">Interview</span>
              </Link>
              <Link to="/dialogue" className="p-4 rounded-xl bg-brand-50 border-2 border-brand-100 text-center hover:border-brand-300 transition-colors">
                <span className="text-2xl block mb-2">💬</span>
                <span className="font-medium text-stone-800">Dialogue</span>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {user.role === 'superadmin' && (
                <Link to="/dashboard" className="btn-primary text-center">
                  Admin Dashboard
                </Link>
              )}
              <button onClick={() => logout()} className="btn-secondary">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
            <Link to="/login" className="btn-primary text-center min-w-[180px]">
              Login
            </Link>
            <Link to="/register" className="btn-secondary text-center min-w-[180px]">
              Get started free
            </Link>
          </div>
        )}

        {/* Bottom accent */}
        <div className="mt-24 flex gap-2 text-sm text-stone-400">
          <span className="px-3 py-1 rounded-full bg-stone-100">German</span>
          <span className="px-3 py-1 rounded-full bg-stone-100">Vocabulary</span>
          <span className="px-3 py-1 rounded-full bg-stone-100">Learn</span>
        </div>
      </div>
    </div>
  );
}
