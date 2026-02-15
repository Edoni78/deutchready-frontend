import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { getTracksWithProgress, completeLesson } from '../api/tracks';

export default function Courses() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTracksWithProgress()
      .then((res) => setTracks(res.data || []))
      .catch(() => setTracks([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCompleteLesson = async (lessonId) => {
    try {
      await completeLesson(lessonId);
      getTracksWithProgress().then((res) => setTracks(res.data || []));
    } catch (err) {
      console.error(err);
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

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Courses</h1>

      {tracks.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-stone-500">No tracks yet. Check back later.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {tracks.map((track) => (
            <div key={track.id} className="card overflow-hidden">
              <div className="p-6 border-b border-stone-100">
                <h2 className="text-xl font-bold text-stone-800">{track.name}</h2>
              </div>
              {track.modules?.map((mod) => (
                <div key={mod.id} className="border-b border-stone-100 last:border-0">
                  <div className="px-6 py-3 bg-stone-50">
                    <h3 className="font-semibold text-stone-700">{mod.title}</h3>
                  </div>
                  {mod.lessons?.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`flex items-center justify-between px-6 py-4 ${
                        lesson.unlocked ? 'hover:bg-cream-50/50' : 'opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          lesson.completed ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'
                        }`}>
                          {lesson.completed ? '✓' : lesson.unlocked ? '○' : '🔒'}
                        </span>
                        <div>
                          <p className="font-medium text-stone-800">{lesson.title}</p>
                          {lesson.Words?.length > 0 && (
                            <p className="text-sm text-stone-500">{lesson.Words.length} words</p>
                          )}
                        </div>
                      </div>
                      {lesson.unlocked && !lesson.completed && (
                        <button
                          onClick={() => handleCompleteLesson(lesson.id)}
                          className="btn-primary py-2 px-4 text-sm"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
