import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { getDialogue, submitDialogue } from '../api/dialogue';

export default function Dialogue() {
  const [dialogue, setDialogue] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadDialogue();
  }, []);

  const loadDialogue = () => {
    setLoading(true);
    setDialogue(null);
    setAnswer('');
    setResult(null);
    getDialogue()
      .then((res) => setDialogue(res.data))
      .catch(() => setDialogue(null))
      .finally(() => setLoading(false));
  };

  const handleSubmit = async () => {
    if (!dialogue || !answer.trim()) return;
    try {
      const { data } = await submitDialogue(dialogue.id, answer);
      setResult(data);
      setTimeout(() => loadDialogue(), 2000);
    } catch (err) {
      setResult({ correct: false, correctAnswer: dialogue.correctAnswer });
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

  if (!dialogue) {
    return (
      <AppLayout>
        <div className="card p-12 text-center">
          <p className="text-stone-500">No dialogues available.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Micro Dialogue Practice</h1>
      <p className="text-stone-500 mb-6">Fill in the blank with the correct phrase</p>

      <div className="card p-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-stone-800 mb-4">{dialogue.title}</h2>
        <p className="text-xl text-stone-700 mb-6 leading-relaxed">{dialogue.displayText}</p>

        {result && (
          <div className={`mb-6 p-4 rounded-2xl ${result.correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {result.correct ? (
              <>✓ Correct! Score: {result.score}</>
            ) : (
              <>✗ The correct phrase was: "{result.correctAnswer}"</>
            )}
          </div>
        )}

        <div className="space-y-4">
          <label className="block text-sm font-medium text-stone-700">Your answer</label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type the missing phrase..."
            className="input-field"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className="btn-primary w-full disabled:opacity-50"
          >
            Check
          </button>
        </div>
        <button onClick={loadDialogue} className="mt-4 text-sm text-stone-500 hover:text-stone-700">
          Next dialogue →
        </button>
      </div>
    </AppLayout>
  );
}
