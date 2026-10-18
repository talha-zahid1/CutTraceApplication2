import { useState } from "react";
import logotransparent from "../assets/logotransparent.png"
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/auth";

const emptyform={
  username:"",
  email:"",
  phone_no:"",
  password:"",
}
export default function Signup() {
  const [form, setform] = useState(emptyform)
  const [confirmpassword, setconfirmpassword] = useState('')
  const [error, seterror] = useState('')
  const navigate=useNavigate()
const handle_change=(e)=>{
  const {name,value}=e.target
  setform((prev) => ({
      ...prev,
      [name]: value,
    }));
}
const handlesubmit=async(e)=>{
  e.preventDefault()
  try {
    if (isempty(form)) {
      throw new Error(
        'Please Fill Out the empty field'
      )
    }
    if (form.password!=confirmpassword) {
      throw new Error("The passwords you entered don't match. Please re-enter them.")
    }
    const resp=await api.post('register/',form)
    if (resp?.data?.status) {
      navigate('/dashboard')
    }
  } catch (error) {
    seterror(
      error.resp?.data?.message||error.resp?.data?.error||error.resp?.data?.detail||error.message
    )
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

        {/* TODO: error message yahan */}

        {/* TODO: form ka onSubmit yahan */}
        <form className="mt-6 space-y-4"
        onSubmit={handlesubmit}
        >
          {error && <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-4 text-center">
          <AlertCircle size={28} className="text-red-500" />

          <p className="text-sm font-medium text-red-500">
            Unable to load or process fabric entries
          </p>

          <p className="max-w-lg break-words text-sm text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchData}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>}
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>
            {/* TODO: value + onChange */}
            <input
              id="name"
              name="name"
              type="text"
              value={form.username}
              placeholder="Your full name"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
              placeholder="you@company.com"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">Contact No</label>
            
            <input
              id="phone"
              name="phone_no"
              type="tel"
              value={form.phone_no}
              onChange={handle_change}
              placeholder="03XX XXXXXXX"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
              placeholder="Password"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-slate-700">Confirm password</label>
            {/* TODO: value + onChange */}
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmpassword}
              onChange={(e)=>{
                setconfirmpassword(e.target.value)
              }}
              placeholder="Confirm password"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* TODO: loading state par disabled */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700"
          >
            Create account
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