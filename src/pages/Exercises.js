import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { getExercise, submitExercise } from '../api/exercise';

const TYPES = [
  { id: 'multiple', label: 'Multiple Choice', icon: '✓' },
  { id: 'fill', label: 'Fill in Blank', icon: '✏️' },
  { id: 'match', label: 'Match Pairs', icon: '🔗' },
];

export default function Exercises() {
  const [type, setType] = useState('multiple');
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [matchPairs, setMatchPairs] = useState([]);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadExercise = () => {
    setLoading(true);
    setExercise(null);
    setAnswer('');
    setSelectedId(null);
    setMatchPairs([]);
    setResult(null);
    getExercise(type)
      .then((res) => setExercise(res.data))
      .catch(() => setExercise(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (type) loadExercise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleSubmit = async () => {
    if (!exercise || submitting) return;
    setSubmitting(true);
    let payload = { type };
    if (type === 'multiple') payload = { ...payload, wordId: selectedId, correctId: exercise.correctId };
    else if (type === 'fill') payload = { ...payload, wordId: exercise.question?.wordId, answer };
    else if (type === 'match') payload = { ...payload, pairs: matchPairs };
    try {
      const { data } = await submitExercise(payload);
      setResult(data);
      setTimeout(() => {
        setResult(null);
        loadExercise();
      }, 1500);
    } catch (err) {
      setResult({ correct: false });
    }
    setSubmitting(false);
  };

  const canSubmit = type === 'multiple' ? selectedId : type === 'fill' ? answer.trim() : matchPairs.length === (exercise?.pairs?.length || 0);

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Exercises</h1>

      <div className="flex gap-2 mb-8">
        {TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
              type === t.id ? 'bg-brand-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 rounded-2xl border-2 border-brand-200 border-t-brand-600 animate-spin" />
        </div>
      ) : !exercise ? (
        <div className="card p-12 text-center">
          <p className="text-stone-500">Not enough words. Add words in the admin dashboard.</p>
        </div>
      ) : (
        <div className="card p-8 max-w-2xl">
          {result && (
            <div className={`mb-6 p-4 rounded-2xl ${result.correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {result.correct ? `✓ Correct! +${result.xpGained || 10} XP` : '✗ Incorrect'}
            </div>
          )}

          {type === 'multiple' && (
            <>
              <p className="text-2xl font-bold text-stone-800 mb-6">What does "{exercise.question?.german}" mean?</p>
              <div className="space-y-2">
                {exercise.options?.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedId(opt.id)}
                    className={`w-full p-4 rounded-xl text-left font-medium transition-colors ${
                      selectedId === opt.id ? 'bg-brand-100 border-2 border-brand-500' : 'bg-stone-50 border-2 border-transparent hover:bg-stone-100'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </>
          )}

          {type === 'fill' && (
            <>
              <p className="text-2xl font-bold text-stone-800 mb-2">Type the German word for:</p>
              <p className="text-xl text-stone-600 mb-6">"{exercise.question?.english}"</p>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="German word..."
                className="input-field text-lg"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </>
          )}

          {type === 'match' && (
            <>
              <p className="text-xl font-bold text-stone-800 mb-6">Match each German word to its English translation</p>
              <div className="space-y-4">
                {exercise.pairs?.map((pair, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                    <span className="font-medium text-stone-800 w-32">{pair.german}</span>
                    <span className="text-stone-400">→</span>
                    <select
                      className="input-field flex-1"
                      value={matchPairs.find((m) => m.german === pair.german)?.english || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setMatchPairs((prev) => {
                          const rest = prev.filter((m) => m.german !== pair.german);
                          if (val) return [...rest, { german: pair.german, english: val, wordId: pair.wordId }];
                          return rest;
                        });
                      }}
                    >
                      <option value="">Select...</option>
                      {exercise.englishOptions?.map((eng, j) => (
                        <option key={j} value={eng}>{eng}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </>
          )}

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="btn-primary mt-6 w-full disabled:opacity-50"
          >
            {submitting ? 'Checking...' : 'Check Answer'}
          </button>
        </div>
      )}
    </AppLayout>
  );
}
