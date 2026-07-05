import { useState } from "react"

const participants = [
  { id: 1, name: "Osita Daniel", avatar: "OD", muted: false, video: true, speaking: true },
  { id: 2, name: "Emmanuel", avatar: "EM", muted: false, video: true, speaking: false },
  { id: 3, name: "Amaka", avatar: "AM", muted: true, video: false, speaking: false },
  { id: 4, name: "Tunde", avatar: "TK", muted: false, video: true, speaking: false },
]

export default function MeetingRoom({ onLeave, meeting }) {
  const [muted, setMuted] = useState(false)
  const [videoOn, setVideoOn] = useState(true)
  const [screenSharing, setScreenSharing] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "Emmanuel", text: "Can everyone see my screen?", time: "2:03 PM" },
    { id: 2, user: "Amaka", text: "Yes, looks good!", time: "2:04 PM" },
  ])
  const [chatInput, setChatInput] = useState("")
  const [elapsed, setElapsed] = useState("14:32")

  const sendChat = () => {
    if (!chatInput.trim()) return
    setChatMessages([...chatMessages, {
      id: chatMessages.length + 1,
      user: "Osita Daniel",
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }])
    setChatInput("")
  }

  return (
    <div className="flex h-full bg-[#0a0a0b]">

      {/* Main video area */}
      <div className="flex-1 flex flex-col">

        {/* Meeting header */}
        <div className="px-6 py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium text-white">{meeting?.title || "Meeting Room"}</span>
            <span className="text-xs text-white/30">{elapsed}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30">{participants.length} participants</span>
          </div>
        </div>

        {/* Video grid */}
        <div className="flex-1 p-4 grid grid-cols-2 gap-3 content-start">
          {participants.map((p) => (
            <div
              key={p.id}
              className={`relative rounded-xl overflow-hidden aspect-video flex items-center justify-center
                ${p.speaking ? "ring-2 ring-[#7F77DD]" : ""}
                bg-[#1a1a1d]`}
            >
              {p.video ? (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#7F77DD] flex items-center justify-center text-xl font-medium text-white">
                    {p.avatar}
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 bg-[#111113] flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-xl font-medium text-white">
                    {p.avatar}
                  </div>
                </div>
              )}

              {/* Name tag */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/50 rounded-lg px-2 py-1">
                <span className="text-xs text-white">{p.name}</span>
                {p.muted && <span className="text-[10px]">🔇</span>}
              </div>

              {/* Speaking indicator */}
              {p.speaking && (
                <div className="absolute top-2 right-2 bg-[#7F77DD] rounded-full px-2 py-0.5">
                  <span className="text-[10px] text-white">Speaking</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Controls bar */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">

          {/* Left controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuted(!muted)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
                muted ? "bg-red-500/20 text-red-400" : "bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              <span className="text-lg">{muted ? "🔇" : "🎤"}</span>
              <span className="text-[10px]">{muted ? "Unmute" : "Mute"}</span>
            </button>

            <button
              onClick={() => setVideoOn(!videoOn)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
                !videoOn ? "bg-red-500/20 text-red-400" : "bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              <span className="text-lg">{videoOn ? "📹" : "🚫"}</span>
              <span className="text-[10px]">{videoOn ? "Stop video" : "Start video"}</span>
            </button>

            <button
              onClick={() => setScreenSharing(!screenSharing)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
                screenSharing ? "bg-green-500/20 text-green-400" : "bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              <span className="text-lg">🖥️</span>
              <span className="text-[10px]">{screenSharing ? "Stop share" : "Share screen"}</span>
            </button>
          </div>

          {/* Center — leave button */}
          <button
            onClick={onLeave}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors"
          >
            Leave call
          </button>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowChat(!showChat); setShowParticipants(false) }}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
                showChat ? "bg-[#7F77DD]/20 text-[#7F77DD]" : "bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              <span className="text-lg">💬</span>
              <span className="text-[10px]">Chat</span>
            </button>

            <button
              onClick={() => { setShowParticipants(!showParticipants); setShowChat(false) }}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
                showParticipants ? "bg-[#7F77DD]/20 text-[#7F77DD]" : "bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              <span className="text-lg">👥</span>
              <span className="text-[10px]">People</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side panel — Chat or Participants */}
      {(showChat || showParticipants) && (
        <div className="w-72 border-l border-white/5 flex flex-col bg-[#111113]">

          {/* Panel header */}
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <span className="text-sm font-medium text-white">
              {showChat ? "Meeting chat" : "Participants"}
            </span>
            <button
              onClick={() => { setShowChat(false); setShowParticipants(false) }}
              className="text-white/30 hover:text-white text-lg"
            >
              ×
            </button>
          </div>

          {/* Chat panel */}
          {showChat && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs font-medium text-white">{msg.user}</span>
                      <span className="text-[10px] text-white/30">{msg.time}</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>
              <div className="px-3 py-3 border-t border-white/5 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  placeholder="Message everyone…"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#7F77DD]"
                />
                <button
                  onClick={sendChat}
                  className="bg-[#7F77DD] text-white px-3 py-2 rounded-lg text-xs"
                >↑</button>
              </div>
            </>
          )}

          {/* Participants panel */}
          {showParticipants && (
            <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
              {participants.map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5">
                  <div className="w-8 h-8 rounded-full bg-[#7F77DD] flex items-center justify-center text-xs font-medium text-white">
                    {p.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-white">{p.name}</p>
                    <p className="text-[10px] text-white/30">{p.speaking ? "Speaking…" : "Listening"}</p>
                  </div>
                  <div className="flex gap-1">
                    {p.muted && <span className="text-xs">🔇</span>}
                    {!p.video && <span className="text-xs">📵</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}