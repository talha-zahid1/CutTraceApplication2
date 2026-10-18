import logotransparent from '../assets/logotransparent.png'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { api,setapiaccesstoken } from '../services/auth';
import { AlertCircle, Loader2 } from 'lucide-react';

const getErrorMessage = (err, fallback) => {
  const body = err.response?.data;

  if (typeof body?.message === "string") return body.message;
  if (typeof body?.detail === "string") return body.detail;
  if (typeof body?.error === "string") return body.error;

  if (body && typeof body === "object") {
    const fieldErrors = Object.entries(body)
      .map(([field, value]) => {
        const message = Array.isArray(value)
          ? value
              .map((item) => (typeof item === "string" ? item : JSON.stringify(item)))
              .join(", ")
          : typeof value === "string"
            ? value
            : "";

        return message ? `${field}: ${message}` : "";
      })
      .filter(Boolean);

    if (fieldErrors.length) {
      return fieldErrors.join(" | ");
    }
  }

  if (err.message === "Network Error" || !err.response) {
    if (err.code === "ECONNABORTED") {
      return "The request timed out. Please try again.";
    }
    if (err.message === "Network Error") {
      return "Unable to connect to the server. Please check your connection.";
    }
  }

  return err.message || fallback;
};

export default function Login() {
  const [error, seterror] = useState("")
  const [password, setpassword] = useState("")
  const [username, setusername] = useState("")
  const [loading, setloading] = useState(false)

  const navigate = useNavigate()

  const submithandler = async (e) => {
    e.preventDefault();

    if (!password && !username ){
      seterror("Please Fill Out the Empty Fields.");
      return;
    }else if (!username ) {
      seterror("Please enter Username.");
      return;
    }else if ( !password) {
      seterror("Please enter password.");
      return;
    }

    if (loading) return;

    seterror("");
    setloading(true);

    try {
      
      const resp = await api.post('api/token/', { username, password })
      setapiaccesstoken(resp.data.access);
      localStorage.setItem("access_token", resp.data.access);
      localStorage.setItem("refresh_token", resp.data.refresh);

      navigate('/dashboard')
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      seterror(getErrorMessage(err, "Login failed. Please check your credentials."));
    } finally {
      setloading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#e3ebfc] via-[#eef1fb] to-[#c9daf8] p-4">
      {/* Background shapes */}
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-blue-400/30 blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl"></div>
      <div className="absolute left-[18%] top-[10%] hidden h-24 w-24 rounded-full border-[16px] border-blue-500/50 sm:block"></div>
      <div className="absolute left-[12%] top-[55%] hidden h-12 w-44 -rotate-[30deg] rounded-full bg-gradient-to-r from-blue-500/60 to-sky-300/60 sm:block"></div>
      <div className="absolute right-[12%] top-[20%] hidden h-12 w-40 rotate-[35deg] rounded-full bg-gradient-to-r from-blue-600/50 to-blue-400/50 sm:block"></div>
      <div className="absolute bottom-[12%] right-[22%] hidden h-16 w-16 rounded-full border-[12px] border-sky-400/50 sm:block"></div>

      {/* Glass card */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/70 bg-white/50 p-8 shadow-[0_20px_60px_-20px_rgba(30,64,175,0.35)] backdrop-blur-xl sm:p-10">
        <img src={logotransparent} alt="CutTrace" className="mx-auto h-12 w-auto" />

        <h1 className="mt-6 text-center text-3xl font-bold text-slate-900">Welcome Back</h1>
        <p className="mt-2 text-center text-sm text-gray-400">Sign in to continue to your account</p>

        <form className="mt-6 space-y-4"
          onSubmit={submithandler}
        >
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p className="break-words">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-slate-700">Username</label>
            <input
              id="username"
              name="username"
              type="username"
              value={username}
              onChange={(e) => {
                setusername(e.target.value);
                if (error) seterror("");
              }}
              disabled={loading}
              placeholder="e.g Alexa"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => {
                setpassword(e.target.value);
                if (error) seterror("");
              }}
              disabled={loading}
              placeholder="Password"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <button
            type="button"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Forgot Password?
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Register */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">Don't have an account yet?</p>
          <Link
            to="/signup"
            className="mt-3 inline-block text-sm font-bold text-blue-600 transition hover:text-blue-800"
          >
            Register for free
          </Link>
        </div>

        {/* Divider */}
        <div className="my-3 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Google Login */}
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.16 13.22l7.98 6.19C13.03 13.72 18.11 9.5 24 9.5Z" transform="translate(0 4)" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.75 7.18l7.73 6C44.43 37.96 46.98 31.81 46.98 24.55Z" />
            <path fill="#FBBC05" d="M10.14 28.58A14.4 14.4 0 0 1 9.5 24c0-1.59.27-3.13.76-4.58l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.77l7.58-6.19Z" transform="translate(0 4)" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-5.89 0-10.88-3.97-12.87-9.3l-7.98 6.19C6.49 43.62 14.62 48 24 48Z" />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}