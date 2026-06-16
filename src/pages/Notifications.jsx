import { useState } from "react"

const allNotifications = [
  {
    id: 1,
    type: "mention",
    icon: "💬",
    title: "Emmanuel mentioned you",
    body: "Hey @Osita can you review the design file I sent?",
    time: "2 mins ago",
    read: false,
    channel: "#design",
  },
  {
    id: 2,
    type: "task",
    icon: "✓",
    title: "Task due today",
    body: "Finish Blast dashboard UI is due today",
    time: "1 hour ago",
    read: false,
    channel: "Tasks",
  },
  {
    id: 3,
    type: "meeting",
    icon: "🎥",
    title: "Meeting in 30 minutes",
    body: "Blast Frontend Review starts at 2:00 PM",
    time: "1 hour ago",
    read: false,
    channel: "Meetings",
  },
  {
    id: 4,
    type: "ai",
    icon: "✦",
    title: "Blast AI reminder",
    body: "You haven't replied to Emmanuel in 2 days. Want me to draft a reply?",
    time: "3 hours ago",
    read: false,
    channel: "AI Assistant",
  },
  {
    id: 5,
    type: "mention",
    icon: "💬",
    title: "Amaka mentioned you",
    body: "@Osita PRD is ready for your review in #product",
    time: "4 hours ago",
    read: true,
    channel: "#product",
  },
  {
    id: 6,
    type: "task",
    icon: "✓",
    title: "Task assigned to you",
    body: "Tunde assigned Set up Supabase auth to you",
    time: "Yesterday",
    read: true,
    channel: "Tasks",
  },
  {
    id: 7,
    type: "meeting",
    icon: "🎥",
    title: "Meeting summary ready",
    body: "AI summary for Weekly Team Retrospective is available",
    time: "Yesterday",
    read: true,
    channel: "Meetings",
  },
  {
    id: 8,
    type: "project",
    icon: "📁",
    title: "Project update",
    body: "Blast Web App progress moved to 65% — 3 tasks completed",
    time: "2 days ago",
    read: true,
    channel: "Projects",
  },
]

const typeColors = {
  mention: "bg-blue-500/20 text-blue-400",
  task: "bg-green-500/20 text-green-400",
  meeting: "bg-purple-500/20 text-purple-400",
  ai: "bg-[#7F77DD]/20 text-[#7F77DD]",
  project: "bg-yellow-500/20 text-yellow-400",
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(allNotifications)
  const [filter, setFilter] = useState("all")

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const markRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const filtered = notifications.filter(n => {
    if (filter === "unread") return !n.read
    if (filter === "mentions") return n.type === "mention"
    if (filter === "tasks") return n.type === "task"
    if (filter === "meetings") return n.type === "meeting"
    return true
  })

  return (
    <div className="p-8 max-w-3xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-white">Notifications</h1>
          <p className="text-white/40 text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-[#7F77DD] hover:text-white transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "unread", "mentions", "tasks", "meetings"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg capitalize transition-colors ${
              filter === f
                ? "bg-[#7F77DD] text-white"
                : "bg-white/5 text-white/40 hover:text-white"
            }`}
          >
            {f}
            {f === "unread" && unreadCount > 0 && (
              <span className="ml-1.5 bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl mb-2">🎉</p>
            <p className="text-sm text-white/30">No notifications here</p>
          </div>
        ) : (
          filtered.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markRead(notif.id)}
              className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                notif.read
                  ? "bg-white/3 border-white/5 opacity-60 hover:opacity-100"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              {/* Icon */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${typeColors[notif.type]}`}>
                {notif.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-medium ${notif.read ? "text-white/50" : "text-white"}`}>
                    {notif.title}
                  </p>
                  <span className="text-[10px] text-white/20 flex-shrink-0">{notif.time}</span>
                </div>
                <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{notif.body}</p>
                <span className="inline-block mt-1.5 text-[10px] bg-white/5 text-white/30 px-2 py-0.5 rounded-full">
                  {notif.channel}
                </span>
              </div>

              {/* Unread dot */}
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-[#7F77DD] flex-shrink-0 mt-1.5" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}