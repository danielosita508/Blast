const navItems = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "channels", icon: "💬", label: "Channels", badge: 3 },
  { id: "messages", icon: "✉️", label: "Direct Messages" },
  { id: "meetings", icon: "🎥", label: "Meetings" },
  { id: "meetingroom", icon: "📹", label: "Join a call" },
  { id: "tasks", icon: "✓", label: "Tasks", badge: 7 },
  { id: "projects", icon: "📁", label: "Projects" },
  { id: "ai", icon: "✦", label: "AI Assistant" },
  { id: "notifications", icon: "🔔", label: "Notifications", badge: 4 },
  { id: "people", icon: "👥", label: "People" },
  { id: "files", icon: "📎", label: "Files" },
  { id: "settings", icon: "⚙️", label: "Settings" },
]

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <div className="w-56 min-w-56 h-screen bg-[#161618] border-r border-white/5 flex flex-col">
      
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#7F77DD]" />
          <span className="text-white font-medium text-lg">Blast</span>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all
              ${activePage === item.id
                ? "bg-white/10 text-white font-medium"
                : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
          >
            <span className="text-base">{item.icon}</span>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className="bg-[#7F77DD] text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* User */}
      <div className="px-2 py-3 border-t border-white/5">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-[#7F77DD] flex items-center justify-center text-xs font-medium">
            OD
          </div>
          <span className="text-sm text-white/70">Osita Daniel</span>
        </div>
      </div>

    </div>
  )
}