import { useState } from "react"


const contacts = [
  { id: 1, name: "Emmanuel", avatar: "EM", status: "online", role: "Designer", unread: 2 },
  { id: 2, name: "Amaka", avatar: "AM", status: "online", role: "Product Manager", unread: 0 },
  { id: 3, name: "Tunde", avatar: "TK", status: "away", role: "Developer", unread: 1 },
  { id: 4, name: "Chidi", avatar: "CH", status: "offline", role: "Marketing", unread: 0 },
  { id: 5, name: "Ngozi", avatar: "NG", status: "online", role: "Developer", unread: 0 },
]

const initialMessages = {
  1: [
    { id: 1, from: "Emmanuel", avatar: "EM", time: "9:00 AM", text: "Hey! Did you check the new Figma designs I sent?" },
    { id: 2, from: "me", avatar: "OD", time: "9:05 AM", text: "Not yet, I'll look at them now." },
    { id: 3, from: "Emmanuel", avatar: "EM", time: "9:06 AM", text: "Cool. Let me know what you think about the sidebar layout." },
    { id: 4, from: "Emmanuel", avatar: "EM", time: "9:20 AM", text: "Also the design file for the AI panel is ready 🎨" },
  ],
  2: [
    { id: 1, from: "Amaka", avatar: "AM", time: "10:00 AM", text: "PRD is ready for review. Can you check it today?" },
    { id: 2, from: "me", avatar: "OD", time: "10:15 AM", text: "Sure, I'll go through it before the 2PM meeting." },
  ],
  3: [
    { id: 1, from: "Tunde", avatar: "TK", time: "8:30 AM", text: "The Supabase PR is ready. Need your review." },
  ],
  4: [],
  5: [
    { id: 1, from: "Ngozi", avatar: "NG", time: "Yesterday", text: "Welcome to the team! Looking forward to working with you." },
    { id: 2, from: "me", avatar: "OD", time: "Yesterday", text: "Thanks Ngozi! Excited to be here." },
  ],
}

const statusColor = {
  online: "bg-green-400",
  away: "bg-yellow-400",
  offline: "bg-white/20",
}

export default function DirectMessages() {
  const [activeContact, setActiveContact] = useState(1)
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")

  const contact = contacts.find(c => c.id === activeContact)

  const sendMessage = () => {
    if (!input.trim()) return
    const newMsg = {
      id: messages[activeContact].length + 1,
      from: "me",
      avatar: "OD",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: input,
    }
    setMessages({ ...messages, [activeContact]: [...messages[activeContact], newMsg] })
    setInput("")
  }

  return (
    <div className="flex h-full">

      {/* Contact list */}
      <div className="w-56 min-w-56 bg-white/3 border-r border-white/5 flex flex-col">
        <div className="px-4 py-4 border-b border-white/5">
          <h2 className="text-sm font-medium text-white">Direct Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveContact(c.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all ${
                activeContact === c.id
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-7 h-7 rounded-full bg-[#7F77DD] flex items-center justify-center text-xs font-medium text-white">
                  {c.avatar}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0f0f10] ${statusColor[c.status]}`} />
              </div>
              <span className="flex-1 text-left text-sm">{c.name}</span>
              {c.unread > 0 && (
                <span className="bg-[#7F77DD] text-white text-[10px] px-1.5 py-0.5 rounded-full">{c.unread}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">

        {/* Top bar */}
        <div className="px-6 py-3.5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#7F77DD] flex items-center justify-center text-xs font-medium text-white">
                {contact.avatar}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0f0f10] ${statusColor[contact.status]}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{contact.name}</p>
              <p className="text-xs text-white/30">{contact.role} · {contact.status}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors text-sm">
              📞
            </button>
            <button className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors text-sm">
              🎥
            </button>
            <button className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors text-sm">
              ℹ️
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {messages[activeContact].length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
              <div className="w-12 h-12 rounded-full bg-[#7F77DD] flex items-center justify-center text-lg font-medium text-white mb-3">
                {contact.avatar}
              </div>
              <p className="text-sm font-medium text-white mb-1">{contact.name}</p>
              <p className="text-xs text-white/30">This is the beginning of your conversation with {contact.name}.</p>
            </div>
          ) : (
            messages[activeContact].map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.from === "me" ? "flex-row-reverse" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-[#7F77DD] flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
                  {msg.avatar}
                </div>
                <div className={`max-w-xs ${msg.from === "me" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.from === "me"
                      ? "bg-[#7F77DD] text-white rounded-tr-sm"
                      : "bg-white/5 text-white/80 rounded-tl-sm"
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-white/20 px-1">{msg.time}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-white/5">
          <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-[#7F77DD] transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={`Message ${contact.name}…`}
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