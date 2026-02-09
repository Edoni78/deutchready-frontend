import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../api/dashboard';
import { getWords, createWord, deleteWord } from '../api/words';
import { useNavigate } from 'react-router-dom';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">DeutchReady Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-slate-500 text-sm">Words</p>
            <p className="text-2xl font-bold text-slate-800">{stats.wordCount}</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-slate-500 text-sm">Users</p>
            <p className="text-2xl font-bold text-slate-800">{stats.userCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Add Word</h2>
          <form onSubmit={handleAddWord} className="flex flex-wrap gap-3">
            <input
              type="text"
              value={newGerman}
              onChange={(e) => setNewGerman(e.target.value)}
              placeholder="German"
              className="px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <input
              type="text"
              value={newEnglish}
              onChange={(e) => setNewEnglish(e.target.value)}
              placeholder="English"
              className="px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category (optional)"
              className="px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              type="submit"
              disabled={adding}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {adding ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <h2 className="text-lg font-semibold text-slate-800 p-4 border-b border-slate-200">
            Words
          </h2>
          <div className="divide-y divide-slate-200">
            {words.length === 0 ? (
              <p className="p-4 text-slate-500 text-sm">No words yet. Add one above.</p>
            ) : (
              words.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-slate-50"
                >
                  <div>
                    <span className="font-medium text-slate-800">{w.german}</span>
                    <span className="text-slate-400 mx-2">→</span>
                    <span className="text-slate-600">{w.english}</span>
                    {w.category && (
                      <span className="ml-2 text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {w.category}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteWord(w.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
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
