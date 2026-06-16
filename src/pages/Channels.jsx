import { useState } from "react"

const channels = [
  { id: 1, name: "general", unread: 3 },
  { id: 2, name: "design", unread: 1 },
  { id: 3, name: "development", unread: 0 },
  { id: 4, name: "product", unread: 2 },
  { id: 5, name: "meetings", unread: 0 },
]

const initialMessages = {
  1: [
    { id: 1, user: "Emmanuel", avatar: "EM", time: "9:12 AM", text: "Good morning team! Ready for the standup?" },
    { id: 2, user: "Osita Daniel", avatar: "OD", time: "9:14 AM", text: "Morning! Yes, give me 5 mins." },
    { id: 3, user: "Amaka", avatar: "AM", time: "9:15 AM", text: "I'm on. Let's go 🚀" },
  ],
  2: [
    { id: 1, user: "Amaka", avatar: "AM", time: "10:30 AM", text: "Here's the updated Figma link for the dashboard redesign." },
    { id: 2, user: "Emmanuel", avatar: "EM", time: "10:45 AM", text: "Looks clean! Left a few comments on the sidebar section." },
  ],
  3: [
    { id: 1, user: "Osita Daniel", avatar: "OD", time: "8:00 AM", text: "Just pushed the Supabase auth branch. PR is ready for review." },
  ],
  4: [
    { id: 1, user: "Amaka", avatar: "AM", time: "11:00 AM", text: "PRD for the AI assistant feature is ready for review." },
    { id: 2, user: "Emmanuel", avatar: "EM", time: "11:20 AM", text: "Reading through it now. Looks solid." },
  ],
 5: [
    { id: 1, user: "Emmanuel", avatar: "EM", time: "7:00 AM", text: "Reminder: Blast frontend review at 2:00 PM today." },
  ],
}
export default function Channels() {
  const [activeChannel, setActiveChannel] = useState(1)
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")

  const sendMessage = () => {
    if (!input.trim()) return
    const newMsg = {
      id: messages[activeChannel].length + 1,
      user: "Osita Daniel",
      avatar: "OD",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: input,
    }
    setMessages({ ...messages, [activeChannel]: [...messages[activeChannel], newMsg] })
    setInput("")
  }

  const channel = channels.find(c => c.id === activeChannel)

  return (
    <div className="flex h-full">
      <div className="w-52 min-w-52 bg-white/3 border-r border-white/5 flex flex-col">
        <div className="px-4 py-4 border-b border-white/5">
          <h2 className="text-sm font-medium text-white">Channels</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {channels.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveChannel(c.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                activeChannel === c.id
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-white/30">#</span>
              <span className="flex-1 text-left">{c.name}</span>
              {c.unread > 0 && (
                <span className="bg-[#7F77DD] text-white text-[10px] px-1.5 py-0.5 rounded-full">{c.unread}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
          <span className="text-white/30 text-lg">#</span>
          <h2 className="text-sm font-medium text-white">{channel.name}</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {messages[activeChannel].map((msg) => (
            <div key={msg.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#7F77DD] flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
                {msg.avatar}
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-medium text-white">{msg.user}</span>
                  <span className="text-[11px] text-white/30">{msg.time}</span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-white/5">
          <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-[#7F77DD] transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={`Message #${channel.name}`}
              className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
            />
            <button
              onClick={sendMessage}
              className="text-[#7F77DD] hover:text-white transition-colors text-sm font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}