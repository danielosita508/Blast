import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

const contacts = [
  { id: "em-user-id", name: "Emmanuel", avatar: "EM", status: "online", role: "Designer" },
  { id: "am-user-id", name: "Amaka", avatar: "AM", status: "online", role: "Product Manager" },
  { id: "tk-user-id", name: "Tunde", avatar: "TK", status: "away", role: "Developer" },
  { id: "ch-user-id", name: "Chidi", avatar: "CH", status: "offline", role: "Marketing" },
  { id: "ng-user-id", name: "Ngozi", avatar: "NG", status: "online", role: "Developer" },
]

const statusColor = {
  online: "bg-green-400",
  away: "bg-yellow-400",
  offline: "bg-white/20",
}

export default function DirectMessages({ user }) {
  const [activeContact, setActiveContact] = useState(contacts[0].id)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [profiles, setProfiles] = useState({})

  useEffect(() => {
    fetchMessages()
    fetchProfile(activeContact)

    // Subscribe to new DM messages between these two users
    const subscription = supabase
      .channel(`dm:${user.id}:${activeContact}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `channel_id=is.null`, // DMs have null channel_id
        },
        (payload) => {
          const newMessage = payload.new
          // Only show messages between these two users
          if (
            (newMessage.user_id === user.id && newMessage.to_user_id === activeContact) ||
            (newMessage.user_id === activeContact && newMessage.to_user_id === user.id)
          ) {
            setMessages((prev) => [...prev, newMessage])
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [activeContact, user.id])

  const fetchMessages = async () => {
    setLoading(true)
    // For now, fetch from a hardcoded conversation
    // In a real app, you'd query messages where (user_id = currentUser AND to_user_id = selectedContact) OR vice versa
    setMessages([])
    setLoading(false)
  }

  const fetchProfile = async (contactId) => {
    if (profiles[contactId]) return

    const contact = contacts.find((c) => c.id === contactId)
    if (contact) {
      setProfiles((prev) => ({ ...prev, [contactId]: contact }))
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    // Insert message — in real implementation this would have a to_user_id field
    const { error } = await supabase.from("messages").insert({
      user_id: user.id,
      text: input,
      created_at: new Date(),
    })

    if (!error) {
      setInput("")
      // In real app, the subscription would auto-add the message
      // For now, just add it locally
      const newMsg = {
        id: Math.random(),
        user_id: user.id,
        text: input,
        created_at: new Date().toISOString(),
      }
      setMessages([...messages, newMsg])
    }
  }

  const contact = profiles[activeContact] || contacts[0]

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
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 rounded-full border-2 border-[#7F77DD] border-t-transparent animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
              <div className="w-12 h-12 rounded-full bg-[#7F77DD] flex items-center justify-center text-lg font-medium text-white mb-3">
                {contact.avatar}
              </div>
              <p className="text-sm font-medium text-white mb-1">{contact.name}</p>
              <p className="text-xs text-white/30">This is the beginning of your conversation with {contact.name}.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.user_id === user.id ? "flex-row-reverse" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-[#7F77DD] flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
                  {msg.user_id === user.id ? "OD" : contact.avatar}
                </div>
                <div className={`max-w-xs ${msg.user_id === user.id ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.user_id === user.id
                      ? "bg-[#7F77DD] text-white rounded-tr-sm"
                      : "bg-white/5 text-white/80 rounded-tl-sm"
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-white/20 px-1">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
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