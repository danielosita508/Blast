import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

const suggestions = [
  "What should I focus on today?",
  "Summarize my upcoming meetings",
  "What tasks are overdue?",
  "Generate a report outline for my IT progress",
  "Help me prioritize my tasks",
]

export default function AIAssistant({ user }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "Good day! I'm your Blast AI assistant. I have full context of your workspace — your tasks, meetings, and projects. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState([])
  const [meetings, setMeetings] = useState([])

  useEffect(() => {
    fetchContext()
  }, [])

  const fetchContext = async () => {
    const { data: taskData } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)

    const { data: meetingData } = await supabase
      .from("meetings")
      .select("*")

    if (taskData) setTasks(taskData)
    if (meetingData) setMeetings(meetingData)
  }

  const buildSystemPrompt = () => {
    const openTasks = tasks.filter(t => !t.done)
    const doneTasks = tasks.filter(t => t.done)
    const highPriority = openTasks.filter(t => t.priority === "high")

    return `You are Blast AI, an intelligent executive assistant built into the Blast workspace platform. You are helpful, professional, calm, and proactive.

Here is the current state of the user's workspace:

USER: ${user.email}

TASKS:
- Total tasks: ${tasks.length}
- Open tasks: ${openTasks.length}
- Completed tasks: ${doneTasks.length}
- High priority tasks: ${highPriority.length}
- Task list: ${openTasks.map(t => `"${t.title}" (priority: ${t.priority}, tag: ${t.tag})`).join(", ") || "None"}

MEETINGS:
- Upcoming meetings: ${meetings.length}
- Meeting list: ${meetings.map(m => `"${m.title}" on ${m.date} at ${m.time}`).join(", ") || "None"}

Based on this real workspace data, answer the user's questions helpfully and concisely. When recommending priorities, use the actual task data above. Keep responses focused and actionable. Never make up tasks or meetings that aren't in the data above.`
  }

  const sendMessage = async (text) => {
    const messageText = text || input
    if (!messageText.trim() || loading) return
    setInput("")

    const userMsg = {
      id: messages.length + 1,
      role: "user",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            { role: "system", content: buildSystemPrompt() },
            ...messages.map(m => ({
              role: m.role,
              content: m.text,
            })),
            { role: "user", content: messageText },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      })

      const data = await response.json()
      const aiText = data.choices?.[0]?.message?.content || "I couldn't process that. Please try again."

      const aiMsg = {
        id: messages.length + 2,
        role: "assistant",
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      console.log("AI error:", err)
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        role: "assistant",
        text: "Sorry, I had trouble connecting to the AI. Please check your API key and try again.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }])
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="px-8 py-5 border-b border-white/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#7F77DD] flex items-center justify-center text-sm">✦</div>
        <div>
          <h1 className="text-sm font-medium text-white">Blast AI Assistant</h1>
          <p className="text-xs text-white/30">Powered by Llama 4 Scout · Aware of your real workspace data</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-xs text-white/30">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
              msg.role === "assistant" ? "bg-[#7F77DD] text-white" : "bg-white/10 text-white"
            }`}>
              {msg.role === "assistant" ? "✦" : "OD"}
            </div>
            <div className={`max-w-xl flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-[#7F77DD] text-white rounded-tr-sm"
                  : "bg-white/5 text-white/80 rounded-tl-sm"
              }`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-white/20 px-1">{msg.time}</span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-[#7F77DD] flex items-center justify-center text-xs text-white flex-shrink-0">✦</div>
            <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="px-8 pb-3 flex gap-2 flex-wrap">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => sendMessage(s)}
            disabled={loading}
            className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white px-3 py-1.5 rounded-full transition-colors disabled:opacity-30"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-8 py-4 border-t border-white/5">
        <div className="flex gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#7F77DD] transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask Blast AI anything about your workspace…"
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading}
            className="bg-[#7F77DD] hover:bg-[#6860cc] disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-sm transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}