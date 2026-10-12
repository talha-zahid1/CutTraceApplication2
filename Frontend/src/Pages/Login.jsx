import logotransparent from '../assets/logotransparent.png'

export default function Login() {
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
      <div className="relative w-full max-w-md rounded-3xl border border-white/70 bg-white/50 p-8 shadow-[0_20px_60px_-20px_rgba(30,64,175,0.35)] backdrop-blur-xl sm:p-10 relative">
        <img src={logotransparent} alt="CutTrace" className="mx-auto h-8 w-auto absolute left-9 top-7" />

        <h1 className="mt-8 text-xl font-bold text-slate-900  px-0">Login</h1>

        {/* TODO: error message yahan */}

        {/* TODO: form ka onSubmit yahan */}
        <form className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
            {/* TODO: value + onChange */}
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            {/* TODO: value + onChange */}
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* TODO: onClick yahan */}
          <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Forgot Password?
          </button>

          {/* TODO: loading state par disabled */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Don't have an account yet?{" "}
          {/* TODO: onClick yahan */}
          <button type="button" className="font-bold text-slate-900 hover:text-blue-700">
            Register for free
          </button>
        </p>
      </div>
    </div>
  );
}
