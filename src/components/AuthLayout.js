import { Link } from 'react-router-dom';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cream-50 via-white to-brand-50/30" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] -translate-y-1/2 translate-x-1/3 rounded-full bg-brand-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] translate-y-1/2 -translate-x-1/2 rounded-full bg-warm-100/50 blur-3xl" />
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-stone-600 hover:text-brand-600 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-sm font-bold text-white">D</span>
          </div>
          <span className="font-semibold">DeutchReady</span>
        </Link>

        <div className="card p-8 md:p-10 w-full max-w-md animate-slide-up">
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">{title}</h1>
          <p className="text-stone-500 mb-6">{subtitle}</p>
          {children}
        </div>

        <p className="mt-6 text-stone-400 text-sm">
          © DeutchReady · Learn German vocabulary
        </p>
      </div>
    </div>
  );
}
