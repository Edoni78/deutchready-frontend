import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { getDashboard, getBadges, getAnalytics } from '../api/user';

export default function MyDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [badges, setBadges] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboard(), getBadges(), getAnalytics()])
      .then(([dRes, bRes, aRes]) => {
        setDashboard(dRes.data);
        setBadges(bRes.data || []);
        setAnalytics(aRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 rounded-2xl border-2 border-brand-200 border-t-brand-600 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">My Stats</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-6 border-l-4 border-l-brand-500">
          <p className="text-stone-500 text-sm font-medium">Words Learned</p>
          <p className="text-2xl font-bold text-stone-800">{dashboard?.totalWordsLearned ?? 0}</p>
        </div>
        <div className="card p-6 border-l-4 border-l-green-500">
          <p className="text-stone-500 text-sm font-medium">Accuracy</p>
          <p className="text-2xl font-bold text-stone-800">{dashboard?.accuracyPercentage ?? 0}%</p>
        </div>
        <div className="card p-6 border-l-4 border-l-warm-500">
          <p className="text-stone-500 text-sm font-medium">Streak</p>
          <p className="text-2xl font-bold text-stone-800">{dashboard?.currentStreak ?? 0} days</p>
        </div>
        <div className="card p-6 border-l-4 border-l-purple-500">
          <p className="text-stone-500 text-sm font-medium">Due Today</p>
          <p className="text-2xl font-bold text-stone-800">{dashboard?.wordsDueToday ?? 0}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Level & XP</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-brand-700">Lv {dashboard?.level ?? 1}</span>
            </div>
            <div className="flex-1">
              <p className="text-stone-600">{dashboard?.xp ?? 0} XP</p>
              <p className="text-sm text-stone-500">Keep practicing to level up!</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Weakest Category</h2>
          <p className="text-xl font-medium text-stone-700">{dashboard?.weakestCategory || 'N/A'}</p>
          <p className="text-sm text-stone-500 mt-1">Focus here to improve accuracy</p>
        </div>
      </div>

      <div className="card p-6 mt-6">
        <h2 className="text-lg font-semibold text-stone-800 mb-4">Badges</h2>
        {badges.length === 0 ? (
          <p className="text-stone-500">No badges yet. Complete exercises to earn badges!</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {badges.map((b) => (
              <div
                key={b.id}
                className="px-4 py-2 rounded-xl bg-warm-50 border border-warm-200 flex items-center gap-2"
              >
                <span>{b.icon || '🏆'}</span>
                <div>
                  <p className="font-medium text-stone-800">{b.name}</p>
                  <p className="text-sm text-stone-500">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {analytics && (
        <div className="card p-6 mt-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Analytics</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-stone-500 text-sm">Avg Response Time</p>
              <p className="font-medium">{analytics.averageResponseTimeMs ? `${analytics.averageResponseTimeMs}ms` : 'N/A'}</p>
            </div>
            <div>
              <p className="text-stone-500 text-sm">Category Difficulty</p>
              <div className="mt-2 space-y-1">
                {analytics.categoryDifficulty?.slice(0, 5).map((c, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{c.category}</span>
                    <span>{c.accuracy}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
