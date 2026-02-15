import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../api/dashboard';
import { getWords, createWord, deleteWord } from '../api/words';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ wordCount: 0, userCount: 0 });
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newGerman, setNewGerman] = useState('');
  const [newEnglish, setNewEnglish] = useState('');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    Promise.all([getDashboardStats(), getWords()])
      .then(([statsRes, wordsRes]) => {
        setStats(statsRes.data);
        setWords(wordsRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAddWord = async (e) => {
    e.preventDefault();
    if (!newGerman.trim() || !newEnglish.trim()) return;
    setAdding(true);
    try {
      const { data } = await createWord({
        german: newGerman.trim(),
        english: newEnglish.trim(),
        category: newCategory.trim() || undefined,
      });
      setWords((prev) => [data, ...prev]);
      setStats((prev) => ({ ...prev, wordCount: prev.wordCount + 1 }));
      setNewGerman('');
      setNewEnglish('');
      setNewCategory('');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add word');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteWord = async (id) => {
    if (!window.confirm('Delete this word?')) return;
    try {
      await deleteWord(id);
      setWords((prev) => prev.filter((w) => w.id !== id));
      setStats((prev) => ({ ...prev, wordCount: Math.max(0, prev.wordCount - 1) }));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl border-2 border-brand-200 border-t-brand-600 animate-spin" />
          <p className="text-stone-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-stone-700 hover:text-brand-600 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-soft">
              <span className="text-sm font-bold text-white">D</span>
            </div>
            <span className="font-bold text-lg">DeutchReady</span>
            <span className="text-stone-400 text-sm font-medium ml-1">· Dashboard</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-stone-500 hidden sm:inline">{user?.username || user?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-6 border-l-4 border-l-brand-500">
            <p className="text-stone-500 text-sm font-medium mb-1">Words</p>
            <p className="text-3xl font-bold text-stone-800">{stats.wordCount}</p>
          </div>
          <div className="card p-6 border-l-4 border-l-warm-500">
            <p className="text-stone-500 text-sm font-medium mb-1">Users</p>
            <p className="text-3xl font-bold text-stone-800">{stats.userCount}</p>
          </div>
        </div>

        {/* Add word */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Add new word</h2>
          <form onSubmit={handleAddWord} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newGerman}
              onChange={(e) => setNewGerman(e.target.value)}
              placeholder="German"
              className="input-field flex-1 min-w-0"
            />
            <input
              type="text"
              value={newEnglish}
              onChange={(e) => setNewEnglish(e.target.value)}
              placeholder="English"
              className="input-field flex-1 min-w-0"
            />
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category"
              className="input-field flex-1 min-w-0 sm:max-w-[140px]"
            />
            <button type="submit" disabled={adding} className="btn-primary shrink-0 disabled:opacity-50">
              {adding ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>

        {/* Words list */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-800">Vocabulary</h2>
            <span className="text-sm text-stone-500">{words.length} words</span>
          </div>
          <div className="divide-y divide-stone-100">
            {words.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-stone-400">📖</span>
                </div>
                <p className="text-stone-500 font-medium">No words yet</p>
                <p className="text-stone-400 text-sm mt-1">Add your first word above</p>
              </div>
            ) : (
              words.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-cream-50/50 transition-colors group"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-stone-800">{w.german}</span>
                    <span className="text-stone-300">→</span>
                    <span className="text-stone-600">{w.english}</span>
                    {w.category && (
                      <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
                        {w.category}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteWord(w.id)}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
