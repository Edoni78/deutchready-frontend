import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { startInterview, submitInterview } from '../api/interview';

export default function Interview() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(null);

  useEffect(() => {
    startInterview()
      .then((res) => {
        setQuestions(res.data.questions || []);
        setAnswers({});
      })
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    const ans = questions.map((q) => ({
      questionId: q.id,
      answer: answers[q.id] || '',
    }));
    try {
      const { data } = await submitInterview(ans);
      setSubmitted(data);
    } catch (err) {
      setSubmitted({ score: 0, total: questions.length, percentage: 0 });
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

  if (submitted) {
    return (
      <AppLayout>
        <div className="card p-8 max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Interview Complete</h2>
          <p className="text-4xl font-bold text-brand-600 mb-2">{submitted.percentage}%</p>
          <p className="text-stone-500 mb-6">
            Score: {submitted.score} / {submitted.total}
          </p>
          <button
            onClick={() => {
              setSubmitted(null);
              startInterview().then((res) => {
                setQuestions(res.data.questions || []);
                setAnswers({});
              });
            }}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </AppLayout>
    );
  }

  if (questions.length === 0) {
    return (
      <AppLayout>
        <div className="card p-12 text-center">
          <p className="text-stone-500">No interview questions available.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Interview Simulation</h1>
      <p className="text-stone-500 mb-6">Answer these call center scenario questions (German context)</p>

      <div className="card p-6 space-y-6">
        {questions.map((q, i) => (
          <div key={q.id} className="border-b border-stone-100 last:border-0 pb-6 last:pb-0">
            <div className="flex gap-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-brand-100 text-brand-700 text-xs font-medium">{q.type}</span>
            </div>
            <p className="font-medium text-stone-800 mb-3">{q.questionText}</p>
            <textarea
              value={answers[q.id] || ''}
              onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
              placeholder="Your answer..."
              rows={3}
              className="input-field resize-none"
            />
          </div>
        ))}
        <button onClick={handleSubmit} className="btn-primary w-full">
          Submit Interview
        </button>
      </div>
    </AppLayout>
  );
}
