export default function Dashboard() {
  const tasks = [
    { id: 1, title: "Finish Blast dashboard UI", tag: "Design", due: "Due today", priority: "high" },
    { id: 2, title: "Write IT weekly progress report", tag: "IT", due: "Due Fri", priority: "high" },
    { id: 3, title: "Set up Supabase auth", tag: "Dev", due: "No due date", priority: "med" },
    { id: 4, title: "Research Daily.co pricing", tag: "Research", due: "Next week", priority: "low" },
  ]

  const meetings = [
    { time: "10:00 AM", title: "IT supervisor standup", status: "In 2h" },
    { time: "2:00 PM", title: "Blast frontend review", status: "Upcoming" },
    { time: "4:30 PM", title: "Product sync · Design team", status: "Upcoming" },
  ]

  const priorityColor = {
    high: "bg-red-500",
    med: "bg-yellow-400",
    low: "bg-green-500",
  }

  return (
    <div className="p-8 max-w-4xl">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-white">Good morning, Osita 👋</h1>
        <p className="text-white/40 mt-1 text-sm">Wednesday, 4 June 2026 · 3 urgent items need your attention</p>
      </div>

      {/* AI Briefing */}
      <div className="bg-white/5 border-l-4 border-[#7F77DD] rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] bg-[#EEEDFE] text-[#3C3489] px-2 py-0.5 rounded-full font-medium">✦ AI Briefing</span>
          <span className="text-sm font-medium text-white">Here's what matters most today</span>
        </div>
        <p className="text-sm text-white/60 leading-relaxed">
          You have <span className="text-white font-medium">7 open tasks</span> — 3 are high priority. The <span className="text-white font-medium">Blast frontend review</span> meeting is at 2:00 PM. You haven't replied to <span className="text-white font-medium">Emmanuel</span> in 2 days. Your <span className="text-white font-medium">IT progress report</span> is due Friday.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { num: "7", label: "Open tasks" },
          { num: "3", label: "Meetings today" },
          { num: "5", label: "Unread messages" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 rounded-xl p-4">
            <div className="text-2xl font-medium text-white">{stat.num}</div>
            <div className="text-xs text-white/40 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tasks */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-white">Priority tasks</h2>
          <button className="text-xs text-[#7F77DD] hover:underline">View all →</button>
        </div>
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3 hover:bg-white/8 cursor-pointer border border-white/5 hover:border-white/10 transition-all">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityColor[task.priority]}`} />
              <span className="flex-1 text-sm text-white">{task.title}</span>
              <span className="text-[11px] bg-white/10 text-white/50 px-2 py-0.5 rounded-full">{task.tag}</span>
              <span className="text-[11px] text-white/30">{task.due}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Meetings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-white">Today's meetings</h2>
          <button className="text-xs text-[#7F77DD] hover:underline">View calendar →</button>
        </div>
        <div className="flex flex-col gap-2">
          {meetings.map((meeting) => (
            <div key={meeting.title} className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3 border border-white/5">
              <span className="text-xs text-white/30 min-w-16">{meeting.time}</span>
              <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
              <span className="flex-1 text-sm text-white">{meeting.title}</span>
              <span className="text-[11px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">{meeting.status}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}