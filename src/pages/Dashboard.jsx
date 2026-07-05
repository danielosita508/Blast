import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

export default function Dashboard({ user }) {
  const [tasks, setTasks] = useState([])
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    await Promise.all([fetchTasks(), fetchMeetings(), fetchProfile()])
    setLoading(false)
  }

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
    if (data) setProfile(data)
  }

  const fetchTasks = async () => {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
    if (data) setTasks(data)
  }

  const fetchMeetings = async () => {
    const { data } = await supabase
      .from("meetings")
      .select("*")
      .eq("status", "upcoming")
      .order("date", { ascending: true })
    if (data) setMeetings(data)
  }

  const priorityColor = {
    high: "bg-red-500",
    med: "bg-yellow-400",
    low: "bg-green-500",
  }

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const highPriorityTasks = tasks.filter(t => !t.done && t.priority === "high")
  const overdueTasks = tasks.filter(t => !t.done)
  const completedTasks = tasks.filter(t => t.done)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 rounded-full border-2 border-[#7F77DD] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-white">
          {greeting()}, {profile?.name?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="text-white/40 mt-1 text-sm">
          {today} · {highPriorityTasks.length > 0
            ? `${highPriorityTasks.length} high priority task${highPriorityTasks.length > 1 ? "s" : ""} need your attention`
            : "You're all caught up!"}
        </p>
      </div>

      {/* AI Briefing */}
      <div className="bg-white/5 border-l-4 border-[#7F77DD] rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] bg-[#EEEDFE] text-[#3C3489] px-2 py-0.5 rounded-full font-medium">
            ✦ AI Briefing
          </span>
          <span className="text-sm font-medium text-white">Here's what matters most today</span>
        </div>
        <p className="text-sm text-white/60 leading-relaxed">
          {tasks.length === 0 && meetings.length === 0
            ? "Your workspace is empty. Start by creating tasks and scheduling meetings."
            : `You have ${overdueTasks.length} open task${overdueTasks.length !== 1 ? "s" : ""}${
                highPriorityTasks.length > 0
                  ? ` — ${highPriorityTasks.length} high priority`
                  : ""
              }. ${
                meetings.length > 0
                  ? `You have ${meetings.length} upcoming meeting${meetings.length !== 1 ? "s" : ""} scheduled.`
                  : "No upcoming meetings."
              } ${completedTasks.length > 0 ? `${completedTasks.length} task${completedTasks.length !== 1 ? "s" : ""} completed so far.` : ""}`
          }
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { num: overdueTasks.length, label: "Open tasks" },
          { num: meetings.length, label: "Upcoming meetings" },
          { num: completedTasks.length, label: "Completed tasks" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 rounded-xl p-4">
            <div className="text-2xl font-medium text-white">{stat.num}</div>
            <div className="text-xs text-white/40 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Priority tasks */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-white">Priority tasks</h2>
          <span className="text-xs text-white/30">{overdueTasks.length} remaining</span>
        </div>
        {tasks.filter(t => !t.done).length === 0 ? (
          <div className="text-center py-8 bg-white/3 rounded-xl border border-white/5">
            <p className="text-sm text-white/30">No open tasks — add some in the Tasks page</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {tasks.filter(t => !t.done).slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3 border border-white/5 hover:border-white/10 transition-all"
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityColor[task.priority] || "bg-white/20"}`} />
                <span className="flex-1 text-sm text-white">{task.title}</span>
                <span className="text-[11px] bg-white/10 text-white/50 px-2 py-0.5 rounded-full">{task.tag}</span>
                {task.due_date && (
                  <span className="text-[11px] text-white/30">{task.due_date}</span>
                )}
              </div>
            ))}
            {tasks.filter(t => !t.done).length > 5 && (
              <p className="text-xs text-white/30 text-center pt-1">
                +{tasks.filter(t => !t.done).length - 5} more tasks
              </p>
            )}
          </div>
        )}
      </div>

      {/* Upcoming meetings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-white">Upcoming meetings</h2>
          <span className="text-xs text-white/30">{meetings.length} scheduled</span>
        </div>
        {meetings.length === 0 ? (
          <div className="text-center py-8 bg-white/3 rounded-xl border border-white/5">
            <p className="text-sm text-white/30">No upcoming meetings — schedule one in Meetings</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {meetings.slice(0, 3).map((meeting) => (
              <div
                key={meeting.id}
                className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3 border border-white/5"
              >
                <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                <span className="flex-1 text-sm text-white">{meeting.title}</span>
                <span className="text-xs text-white/30">{meeting.date} · {meeting.time}</span>
                <span className="text-[11px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                  {meeting.duration}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}