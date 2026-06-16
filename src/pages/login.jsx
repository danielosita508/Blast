import { useState } from "react"

export default function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please fill in all fields.")
      return
    }
    setError("")
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onLogin()
    }, 1500)
  }

  return (
    <div className="min-h-screen w-screen bg-[#0f0f10] flex items-center justify-center px-4">

      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#7F77DD]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-[#7F77DD]" />
          <span className="text-white font-medium text-xl">Blast</span>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">

          <h1 className="text-xl font-medium text-white mb-1">Welcome back</h1>
          <p className="text-sm text-white/40 mb-6">Sign in to your workspace</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 mb-4">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs text-white/50 mb-1.5">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="you@company.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#7F77DD] transition-colors"
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="block text-xs text-white/50 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#7F77DD] transition-colors"
            />
          </div>

          {/* Forgot password */}
          <div className="flex justify-end mb-6">
            <button className="text-xs text-[#7F77DD] hover:text-white transition-colors">
              Forgot password?
            </button>
          </div>

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#7F77DD] hover:bg-[#6860cc] disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30">or continue with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google button */}
          <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
            <span>G</span>
            <span>Continue with Google</span>
          </button>

        </div>

        {/* Switch to signup */}
        <p className="text-center text-sm text-white/30 mt-5">
          Don't have an account?{" "}
          <button onClick={onSwitch} className="text-[#7F77DD] hover:text-white transition-colors">
            Create one
          </button>
        </p>

      </div>
    </div>
  )
}