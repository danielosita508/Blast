import { useState } from "react"

const suggestions = [
  "What should I focus on today?",
  "Summarize yesterday's meetings",
  "What tasks are overdue?",
  "Generate a report outline for my IT progress",
  "What did the design team discuss this week?",
  "Create tasks from my meeting notes",
]

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    text: "Good morning, Osita 👋 I'm your Blast AI assistant. I have full context of your workspace — your tasks, meetings, messages, and projects. How can I help you today?",
    time: "10:00 AM",
  },
]

export default function AIAssistant() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const aiResponses = {
    "focus": "Based on your current tasks and deadlines, here's what I recommend focusing on today:\n\n1. **Finish Blast dashboard UI** — due today, high priority\n2. **Reply to Emmanuel** — he's been waiting 2 days about the design file\n3. **Prepare for the 2PM meeting** — Blast Frontend Review has no agenda yet\n\nShall I generate an agenda for your meeting?",
    "meeting": "Here's a summary of yesterday's meetings:\n\n**Weekly Team Retrospective (11:00 AM)**\n• Discussed sprint progress across 3 projects\n• Identified 2 blockers: Supabase auth delay, Daily.co integration\n• Agreed on new task assignment process going forward\n• Action items assigned to OD and TK\n\nWant me to create tasks from these action items?",
    "overdue": "You currently have **2 overdue items**:\n\n• **Reply to Emmanuel** — 2 days overdue (Design)\n• **IT Weekly Report** — was due last Friday\n\nI also see 3 tasks with upcoming deadlines in the next 48 hours. Should I reschedule any of these?",
    "report": "Here's an outline for your IT Progress Report:\n\n**IT Industrial Training — Weekly Progress Report**\n\n1. Executive Summary\n2. Tasks completed this week\n3. Tasks in progress\n4. Blockers and challenges\n5. Learning outcomes\n6. Plan for next week\n\nShall I fill in details from your actual tasks this week?",
    "default": "I understand your request. Based on your workspace activity, I can see you have 7 open tasks, 3 meetings today, and 5 unread messages. Let me help you with that — could you give me a bit more detail so I can give you the most accurate answer?",
  }

  const getResponse = (text) => {
    const lower = text.toLowerCase()
    if (lower.includes("focus") || lower.includes("today")) return aiResponses.focus
    if (lower.includes("meeting") || lower.includes("summary") || lower.includes("summarize")) return aiResponses.meeting
    if (lower.includes("overdue") || lower.includes("late") || lower.includes("missed")) return aiResponses.overdue
    if (lower.includes("report") || lower.includes("outline")) return aiResponses.report
    return aiResponses.default
  }

  const sendMessage = (text) => {
    const messageText = text || input
    if (!messageText.trim()) return
    setInput("")

    const userMsg = {
      id: messages.length + 1,
      role: "user",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    setTimeout(() => {
      const aiMsg = {
        id: messages.length + 2,
        role: "assistant",
        text: getResponse(messageText),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages(prev => [...prev, aiMsg])
      setLoading(false)
    }, 1200)
  }

  const formatText = (text) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <p key={i} className="font-medium text-white mb-1">{line.replace(/\*\*/g, "")}</p>
      }
      if (line.startsWith("•")) {
        return <p key={i} className="text-white/70 pl-2 mb-0.5">{line}</p>
      }
      if (line.match(/^\d\./)) {
        return <p key={i} className="text-white/70 pl-2 mb-0.5">{line}</p>
      }
      if (line === "") return <div key={i} className="h-2" />
      return <p key={i} className="text-white/70">{line}</p>
    })
  }

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="px-8 py-5 border-b border-white/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#7F77DD] flex items-center justify-center text-sm">✦</div>
        <div>
          <h1 className="text-sm font-medium text-white">Blast AI Assistant</h1>
          <p className="text-xs text-white/30">Aware of your tasks, meetings, messages and projects</p>
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

            {/* Avatar */}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
              msg.role === "assistant" ? "bg-[#7F77DD] text-white" : "bg-white/10 text-white"
            }`}>
              {msg.role === "assistant" ? "✦" : "OD"}
            </div>

            {/* Bubble */}
            <div className={`max-w-xl ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#7F77DD] text-white rounded-tr-sm"
                  : "bg-white/5 rounded-tl-sm"
              }`}>
                {msg.role === "assistant" ? formatText(msg.text) : msg.text}
              </div>
              <span className="text-[10px] text-white/20 px-1">{msg.time}</span>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
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
        {suggestions.slice(0, 3).map((s) => (
          <button
            key={s}
            onClick={() => sendMessage(s)}
            className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white px-3 py-1.5 rounded-full transition-colors"
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
          />
          <button
            onClick={() => sendMessage()}
            className="bg-[#7F77DD] hover:bg-[#6860cc] text-white px-4 py-1.5 rounded-lg text-sm transition-colors"
          >
            Send
          </button>
        </div>
      </div>

    </div>
  )
}