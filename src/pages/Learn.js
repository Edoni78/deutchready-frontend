import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { getTodayWords, submitAnswer } from '../api/learn';

export default function Learn() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = () => {
    setLoading(true);
    getTodayWords()
      .then((res) => {
        setWords(res.data.words || []);
        setIndex(0);
        setFlipped(false);
        setResult(null);
        setStartTime(Date.now());
      })
      .catch(() => setWords([]))
      .finally(() => setLoading(false));
  };

  const current = words[index];

  const handleReveal = () => {
    setFlipped(true);
  };

  const handleAnswer = async (isCorrect) => {
    if (!current || submitting) return;
    setSubmitting(true);
    const responseTimeMs = Math.max(0, Date.now() - (startTime || Date.now()));
    try {
      const { data } = await submitAnswer({
        wordId: current.id,
        userWordId: current.userWordId || null,
        isCorrect,
        responseTimeMs,
      });
      setResult({ correct: isCorrect, xpGained: data.xpGained, badges: data.awardedBadges });
      setTimeout(() => {
        setResult(null);
        setFlipped(false);
        if (index < words.length - 1) {
          setIndex((i) => i + 1);
          setStartTime(Date.now());
        } else {
          loadWords();
        }
        setSubmitting(false);
      }, 800);
    } catch (err) {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 rounded-2xl border-2 border-brand-200 border-t-brand-600 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (words.length === 0) {
    return (
      <AppLayout>
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-stone-800 mb-2">All caught up!</h2>
          <p className="text-stone-500 mb-6">No words due for review today. Check back tomorrow or add new words.</p>
          <button onClick={loadWords} className="btn-primary">Refresh</button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-stone-800">Learn</h1>
          <span className="text-sm text-stone-500">{index + 1} / {words.length}</span>
        </div>

        {result && (
          <div className={`mb-6 p-4 rounded-2xl ${result.correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {result.correct ? (
              <>✓ Correct! +{result.xpGained} XP {result.badges?.length ? `· New badge!` : ''}</>
            ) : (
              <>✗ Incorrect. Try again next time!</>
            )}
          </div>
        )}

        <div
          onClick={() => !flipped && handleReveal()}
          className={`card p-12 cursor-pointer select-none min-h-[200px] flex flex-col items-center justify-center transition-all ${
            !flipped ? 'hover:shadow-glow' : ''
          }`}
        >
          {!flipped ? (
            <p className="text-3xl font-bold text-stone-800 text-center">{current.german}</p>
          ) : (
            <>
              <p className="text-2xl font-bold text-stone-800 mb-2">{current.german}</p>
              <p className="text-xl text-stone-600">{current.english}</p>
              {current.category && (
                <span className="mt-2 text-sm text-brand-600 bg-brand-50 px-2 py-1 rounded-lg">{current.category}</span>
              )}
            </>
          )}
        </div>

        {flipped && !result && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => handleAnswer(false)}
              disabled={submitting}
              className="flex-1 py-3 px-4 rounded-2xl border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 disabled:opacity-50"
            >
              Incorrect
            </button>
            <button
              onClick={() => handleAnswer(true)}
              disabled={submitting}
              className="flex-1 py-3 px-4 rounded-2xl bg-green-500 text-white font-semibold hover:bg-green-600 disabled:opacity-50"
            >
              Correct
            </button>
          </div>
        )}

        {!flipped && (
          <p className="text-center text-stone-400 text-sm mt-4">Click the card to reveal the answer</p>
        )}
      </div>
    </AppLayout>
  );
}
