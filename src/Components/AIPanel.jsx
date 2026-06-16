export default function AIPanel() {
  return (
    <div className="w-60 min-w-60 h-screen bg-[#161618] border-l border-white/5 flex flex-col">
      
      {/* Header */}
      <div className="px-4 py-4 border-b border-white/5 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#7F77DD] flex items-center justify-center text-xs">✦</div>
        <span className="text-sm font-medium text-white">Blast AI</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3">
        
        <div>
          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Smart Reminders</p>
          <div className="bg-white/5 rounded-lg p-3 text-xs text-white/60 leading-relaxed border-l-2 border-red-400">
            You haven't replied to <span className="text-white">Emmanuel</span> in 2 days.
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-xs text-white/60 leading-relaxed border-l-2 border-yellow-400 mt-2">
            <span className="text-white">IT progress report</span> is due Friday. Not started yet.
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-xs text-white/60 leading-relaxed border-l-2 border-blue-400 mt-2">
            Your 2:00 PM meeting has no agenda. Want me to generate one?
          </div>
        </div>

        <div>
          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Suggested Actions</p>
          <div className="bg-white/5 rounded-lg p-3 text-xs text-white/60 leading-relaxed">
            Draft a reply to Emmanuel about the design file.
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-xs text-white/60 leading-relaxed mt-2">
            Start IT report — I can generate an outline.
          </div>
        </div>

      </div>

      {/* Chat input */}
      <div className="px-3 py-3 border-t border-white/5 flex gap-2">
        <input
          type="text"
          placeholder="Ask Blast AI…"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#7F77DD]"
        />
        <button className="bg-[#7F77DD] px-3 py-2 rounded-lg text-xs text-white hover:bg-[#6860cc] transition-colors">
          ↑
        </button>
      </div>

    </div>
  )
}