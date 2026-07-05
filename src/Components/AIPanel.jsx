import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

export default function AIPanel({ user }) {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [briefingLoading, setBriefingLoading] = useState(true)
  const [reminders, setReminders] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [chatMessages, setChatMessages] = useState([])
  const [tasks, setTasks] = useState([])
  const [meetings, setMeetings] = useState([])

  useEffect(() => {
    if (user) {
      fetchDataAndGenerateBriefing()
    }
  }, [user])

  const fetchDataAndGenerateBriefing = async () => {
    setBriefingLoading(true)

    const { data: taskData } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)

    const { data: meetingData } = await supabase
      .from("meetings")
      .select("*")
      .eq("status", "upcoming")

    const tasks = taskData || []
    const meetings = meetingData || []

    setTasks(tasks)
    setMeetings(meetings)

    await generateBriefing(tasks, meetings)
    setBriefingLoading(false)
  }

  const generateBriefing = async (tasks, meetings) => {
    const openTasks = tasks.filter(t => !t.done)
    const highPriority = openTasks.filter(t => t.priority === "high")

    const prompt = `You are Blast AI, a smart executive assistant. Based on this workspace data, generate exactly 3 smart reminders and 2 suggested actions. Be specific and use the actual data provided.

TASKS: ${openTasks.map(t => `"${t.title}" (priority: ${t.priority})`).join(", ") || "No open tasks"}
MEETINGS: ${meetings.map(m => `"${m.title}" on ${m.date} at ${m.time}`).join(", ") || "No upcoming meetings"}

Respond ONLY with valid JSON in this exact format, nothing else:
{
  "reminders": [
    {"text": "reminder text here", "type": "alert"},
    {"text": "reminder text here", "type": "warning"},
    {"text": "reminder text here", "type": "info"}
  ],
  "suggestions": [
    {"text": "suggested action here"},
    {"text": "suggested action here"}
  ]
}`

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 400,
          temperature: 0.5,
        }),
      })

      const data = await response.json()
      const text = data.choices?.[0]?.message?.content || ""

      const clean = text.replace(/```json|```/g, "").trim()
      const parsed = JSON.parse(clean)

      setReminders(parsed.reminders || [])
      setSuggestions(parsed.suggestions || [])
    } catch (err) {
      // Fallback if AI fails
      setReminders([
        { text: `You have ${tasks.filter(t => !t.done).length} open tasks`, type: "info" },
        { text: meetings.length > 0 ? `${meetings.length} upcoming meeting${meetings.length > 1 ? "s" : ""} scheduled` : "No upcoming meetings", type: "info" },
      ])
      setSuggestions([
        { text: "Review your open tasks and set priorities" },
        { text: "Check your upcoming meetings" },
      ])
    }
  }

  const sendChat = async () => {
    if (!input.trim() || loading) return
    const userText = input
    setInput("")

    const userMsg = { role: "user", text: userText }
    setChatMessages(prev => [...prev, userMsg])
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
            {
              role: "system",
              content: `You are Blast AI, a smart executive assistant. The user has ${tasks.filter(t => !t.done).length} open tasks and ${meetings.length} upcoming meetings. Be helpful, concise and actionable. Max 2-3 sentences.`
            },
            ...chatMessages.map(m => ({ role: m.role, content: m.text })),
            { role: "user", content: userText }
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      })

      const data = await response.json()
      const aiText = data.choices?.[0]?.message?.content || "I couldn't process that. Try again."
      setChatMessages(prev => [...prev, { role: "assistant", text: aiText }])
    } catch (err) {
      setChatMessages(prev => [...prev, { role: "assistant", text: "Connection error. Please try again." }])
    }

    setLoading(false)
  }

  const reminderColor = {
    alert: "border-red-400",
    warning: "border-yellow-400",
    info: "border-blue-400",
  }

  return (
    <div className="w-60 min-w-60 h-screen bg-[#161618] border-l border-white/5 flex flex-col">

      {/* Header */}
      <div className="px-4 py-4 border-b border-white/5 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#7F77DD] flex items-center justify-center text-xs">✦</div>
        <span className="text-sm font-medium text-white">Blast AI</span>
        {!briefingLoading && (
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3">

        {briefingLoading ? (
          <div className="flex flex-col gap-2">
            <p className="text-[10px] text-white/30 uppercase tracking-widest">Generating briefing…</p>
            <div className="flex gap-1 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#7F77DD]/50 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-[#7F77DD]/50 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-[#7F77DD]/50 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        ) : (
          <>
            {/* Smart Reminders */}
            {reminders.length > 0 && (
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Smart Reminders</p>
                <div className="flex flex-col gap-2">
                  {reminders.map((r, i) => (
                    <div
                      key={i}
                      className={`bg-white/5 rounded-lg p-3 text-xs text-white/60 leading-relaxed border-l-2 ${reminderColor[r.type] || "border-blue-400"}`}
                    >
                      {r.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Actions */}
            {suggestions.length > 0 && (
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Suggested Actions</p>
                <div className="flex flex-col gap-2">
                  {suggestions.map((s, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-3 text-xs text-white/60 leading-relaxed">
                      {s.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chat history */}
            {chatMessages.length > 0 && (
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Chat</p>
                <div className="flex flex-col gap-2">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`rounded-lg p-3 text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#7F77DD]/20 text-white/80 ml-2"
                          : "bg-white/5 text-white/60"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {loading && (
                    <div className="bg-white/5 rounded-lg p-3 flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1 h-1 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1 h-1 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Chat input */}
      <div className="px-3 py-3 border-t border-white/5 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendChat()}
          placeholder="Ask Blast AI…"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#7F77DD]"
        />
        <button
          onClick={sendChat}
          disabled={loading}
          className="bg-[#7F77DD] disabled:opacity-50 px-3 py-2 rounded-lg text-xs text-white"
        >
          ↑
        </button>
      </div>
    </div>
  )
} 