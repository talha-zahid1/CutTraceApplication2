import { useState } from "react";
import logotransparent from "../assets/logotransparent.png"
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/auth";
import { AlertCircle, Loader2 } from "lucide-react";

const emptyform = {
  username: "",
  email: "",
  mobile_no: "",
  password: "",
}

// Saare required fields filled hain ya nahi check karta hai.
const isempty = (form) => {
  return Object.values(form).some((value) => !value || !value.trim());
};

const getErrorMessage = (err, fallback) => {
  const body = err.response?.data;

  if (typeof body?.message === "string") return body.message;
  if (typeof body?.detail === "string") return body.detail;
  if (typeof body?.error === "string") return body.error;

  // Backend validation errors (e.g. { email: ["already exists"] })
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
      return "Unable to Signup. Please check your connection.";
    }
  }

  return err.message || fallback;
};

export default function Signup() {
  const [form, setform] = useState(emptyform)
  const [confirmpassword, setconfirmpassword] = useState('')
  const [error, seterror] = useState('')
  const [loading, setloading] = useState(false)
  const navigate = useNavigate()

  const handle_change = (e) => {
    const { name, value } = e.target
    setform((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) seterror("");
  }

  const handlesubmit = async (e) => {
    e.preventDefault()
    if (loading) return;

    seterror("");

    try {
      if (isempty(form)) {
        throw new Error("Please fill out the empty fields.");
      }
      
      if (form.password !== confirmpassword) {
        throw new Error("The passwords you entered don't match. Please re-enter them.");
      }

      setloading(true);
      console.log('form',form)
      const resp = await api.post('register/', form)
      console.log('response',resp?.data?.data)
      if (resp?.data?.status === false) {
        throw new Error(
          getErrorMessage({ response: { data: resp.data } }, "Couldn't create your account.")
        );
      }

      if (resp?.data?.status) {
        const loginResp = await api.post('api/token/', {
          username: form.email,
          password: form.password,
        });
 
        setapiaccesstoken(loginResp.data.access);
        localStorage.setItem("access_token", loginResp.data.access);
        localStorage.setItem("refresh_token", loginResp.data.refresh);
        navigate('/dashboard')
      }
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      seterror(getErrorMessage(err, "Couldn't create your account."));
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

        <h1 className="mt-4 text-center text-3xl font-bold text-slate-900">Sign up</h1>

        <form className="mt-6 space-y-4"
          onSubmit={handlesubmit}
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
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>
            <input
              id="name"
              name="username"
              type="text"
              value={form.username}
              disabled={loading}
              placeholder="Your full name"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              onChange={handle_change}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handle_change}
              disabled={loading}
              placeholder="you@company.com"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700">Contact No</label>

            <input
              id="phone"
              name="mobile_no"
              type="tel"
              value={form.mobile_no}
              onChange={handle_change}
              disabled={loading}
              placeholder="03XX XXXXXXX"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handle_change}
              disabled={loading}
              placeholder="Password"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-slate-700">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmpassword}
              onChange={(e) => {
                setconfirmpassword(e.target.value)
                if (error) seterror("");
              }}
              disabled={loading}
              placeholder="Confirm password"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link to='/' className="font-bold text-slate-900 hover:text-blue-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}