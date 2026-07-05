import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

const channels = [
  { id: 1, name: "general", unread: 0 },
  { id: 2, name: "design", unread: 0 },
  { id: 3, name: "development", unread: 0 },
  { id: 4, name: "product", unread: 0 },
  { id: 5, name: "meetings", unread: 0 },
]

export default function Channels({ user }) {
  const [activeChannel, setActiveChannel] = useState(1)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [profiles, setProfiles] = useState({})

  // Fetch messages and subscribe to real-time updates
  useEffect(() => {
    fetchMessages()
    
    // Subscribe to new messages in real time
    const subscription = supabase
      .channel(`messages:channel_id=eq.${activeChannel}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${activeChannel}`,
        },
        (payload) => {
          const newMessage = payload.new
          fetchProfile(newMessage.user_id)
          setMessages((prev) => [...prev, newMessage])
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [activeChannel])

  const fetchMessages = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("channel_id", activeChannel)
      .order("created_at", { ascending: true })

    if (error) {
      console.log("Error fetching messages:", error)
    } else {
      setMessages(data)
      // Fetch profiles for all message authors
      data.forEach((msg) => {
        fetchProfile(msg.user_id)
      })
    }
    setLoading(false)
  }

  const fetchProfile = async (userId) => {
    if (profiles[userId]) return

    const { data, error } = await supabase
      .from("profiles")
      .select("name, avatar")
      .eq("id", userId)
      .single()

    if (!error && data) {
      setProfiles((prev) => ({ ...prev, [userId]: data }))
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const { error } = await supabase.from("messages").insert({
      channel_id: activeChannel,
      user_id: user.id,
      text: input,
    })

    if (!error) {
      setInput("")
    }
  }

  const channel = channels.find((c) => c.id === activeChannel)
  const profile = profiles[user?.id] || { name: "You", avatar: "OD" }

  return (
    <div className="flex h-full">
      {/* Channel list */}
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
            </button>
          ))}
        </div>
      </div>

      {/* Message area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
          <span className="text-white/30 text-lg">#</span>
          <h2 className="text-sm font-medium text-white">{channel.name}</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 rounded-full border-2 border-[#7F77DD] border-t-transparent animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <p className="text-2xl mb-2">💬</p>
                <p className="text-sm text-white/30">No messages yet. Start the conversation!</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const msgProfile = profiles[msg.user_id] || { name: "Unknown", avatar: "?" }
              return (
                <div key={msg.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#7F77DD] flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
                    {msgProfile.avatar}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm font-medium text-white">{msgProfile.name}</span>
                      <span className="text-[11px] text-white/30">
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              )
            })
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