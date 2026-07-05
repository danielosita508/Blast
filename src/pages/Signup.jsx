import { useState } from "react"
import { supabase } from "../supabaseClient"

export default function Signup({ onSignup, onSwitch }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", workspace: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)

  const update = (field, value) => setForm({ ...form, [field]: value })

  const handleNext = () => {
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.")
      return
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    setError("")
    setStep(2)
  }

  const handleSignup = async () => {
    if (!form.workspace) {
      setError("Please enter a workspace name.")
      return
    }
    setError("")
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name, workspace: form.workspace }
      }
    })

    if (error) {
      setLoading(false)
      setError(error.message)
      return
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        name: form.name,
        email: form.email,
        role: "Member",
        avatar: form.name.split(" ").map(n => n[0]).join("").toUpperCase(),
      })
    }

    setLoading(false)
    onSignup(data.user)
  }

  return (
    <div className="min-h-screen w-screen bg-[#0f0f10] flex items-center justify-center px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#7F77DD]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-[#7F77DD]" />
          <span className="text-white font-medium text-xl">Blast</span>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className={`h-1 rounded-full transition-all ${s === step ? "w-8 bg-[#7F77DD]" : "w-4 bg-white/20"}`} />
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 mb-4">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <>
              <h1 className="text-xl font-medium text-white mb-1">Create your account</h1>
              <p className="text-sm text-white/40 mb-6">Start your Blast workspace for free</p>

              <div className="mb-4">
                <label className="block text-xs text-white/50 mb-1.5">Full name</label>
                <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Osita Daniel" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#7F77DD] transition-colors" />
              </div>

              <div className="mb-4">
                <label className="block text-xs text-white/50 mb-1.5">Email address</label>
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@company.com" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#7F77DD] transition-colors" />
              </div>

              <div className="mb-6">
                <label className="block text-xs text-white/50 mb-1.5">Password</label>
                <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Min. 6 characters" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#7F77DD] transition-colors" />
              </div>

              <button onClick={handleNext} className="w-full bg-[#7F77DD] hover:bg-[#6860cc] text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
                Continue →
              </button>
            </>
          ) : (
            <>
              <h1 className="text-xl font-medium text-white mb-1">Name your workspace</h1>
              <p className="text-sm text-white/40 mb-6">This is where your team will collaborate</p>

              <div className="mb-4">
                <label className="block text-xs text-white/50 mb-1.5">Workspace name</label>
                <input type="text" value={form.workspace} onChange={(e) => update("workspace", e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSignup()} placeholder="Acme Inc, My Startup…" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#7F77DD] transition-colors" />
              </div>

              <div className="mb-6 bg-white/3 border border-white/5 rounded-lg px-4 py-3">
                <p className="text-xs text-white/30 mb-1">Your workspace URL</p>
                <p className="text-sm text-white/60">
                  blast.app/<span className="text-white">{form.workspace.toLowerCase().replace(/\s+/g, "-") || "your-workspace"}</span>
                </p>
              </div>

              <button onClick={handleSignup} disabled={loading} className="w-full bg-[#7F77DD] hover:bg-[#6860cc] disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
                {loading ? "Creating workspace…" : "Create workspace"}
              </button>

              <button onClick={() => setStep(1)} className="w-full mt-3 text-xs text-white/30 hover:text-white transition-colors py-2">
                ← Back
              </button>
            </>
          )}
        </div>

        <p className="text-center text-sm text-white/30 mt-5">
          Already have an account?{" "}
          <button onClick={onSwitch} className="text-[#7F77DD] hover:text-white transition-colors">Sign in</button>
        </p>
      </div>
    </div>
  )
}