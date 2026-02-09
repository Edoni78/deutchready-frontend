import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">DeutchReady</h1>
      <p className="text-slate-600 mb-8">Learn German vocabulary</p>

      {user ? (
        <div className="text-center">
          <p className="text-slate-600 mb-4">Welcome, {user.email}</p>
          {user.role === 'superadmin' && (
            <Link
              to="/dashboard"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Dashboard
            </Link>
          )}
        </div>
      ) : (
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}
