import { useState } from "react"

const members = [
  {
    id: 1,
    name: "Osita Daniel",
    avatar: "OD",
    role: "Product Manager",
    department: "Product",
    status: "online",
    email: "osita@blast.app",
    tasks: 7,
    joined: "Jan 2026",
    color: "#7F77DD",
  },
  {
    id: 2,
    name: "Emmanuel",
    avatar: "EM",
    role: "UI/UX Designer",
    department: "Design",
    status: "online",
    email: "em@blast.app",
    tasks: 4,
    joined: "Jan 2026",
    color: "#378ADD",
  },
  {
    id: 3,
    name: "Amaka",
    avatar: "AM",
    role: "Product Manager",
    department: "Product",
    status: "online",
    email: "amaka@blast.app",
    tasks: 5,
    joined: "Feb 2026",
    color: "#1D9E75",
  },
  {
    id: 4,
    name: "Tunde",
    avatar: "TK",
    role: "Backend Developer",
    department: "Engineering",
    status: "away",
    email: "tunde@blast.app",
    tasks: 9,
    joined: "Feb 2026",
    color: "#EF9F27",
  },
  {
    id: 5,
    name: "Ngozi",
    avatar: "NG",
    role: "Frontend Developer",
    department: "Engineering",
    status: "online",
    email: "ngozi@blast.app",
    tasks: 3,
    joined: "Mar 2026",
    color: "#E24B4A",
  },
  {
    id: 6,
    name: "Chidi",
    avatar: "CH",
    role: "Marketing Lead",
    department: "Marketing",
    status: "offline",
    email: "chidi@blast.app",
    tasks: 2,
    joined: "Mar 2026",
    color: "#7F77DD",
  },
]

const statusColor = {
  online: "bg-green-400",
  away: "bg-yellow-400",
  offline: "bg-white/20",
}

const statusLabel = {
  online: "Online",
  away: "Away",
  offline: "Offline",
}

export default function People() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [selectedMember, setSelectedMember] = useState(null)

  const departments = ["all", ...new Set(members.map(m => m.department))]

  const filtered = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase())
    const matchesDept = filter === "all" || m.department === filter
    return matchesSearch && matchesDept
  })

  if (selectedMember) {
    const m = selectedMember
    return (
      <div className="p-8 max-w-2xl">
        <button
          onClick={() => setSelectedMember(null)}
          className="text-white/30 hover:text-white text-sm transition-colors mb-6"
        >
          ← People
        </button>

        {/* Profile card */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-4">
          <div className="flex items-start gap-5">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-medium text-white"
                style={{ background: m.color }}
              >
                {m.avatar}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#0f0f10] ${statusColor[m.status]}`} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-medium text-white">{m.name}</h2>
              <p className="text-sm text-white/50 mt-0.5">{m.role}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`w-2 h-2 rounded-full ${statusColor[m.status]}`} />
                <span className="text-xs text-white/30">{statusLabel[m.status]}</span>
                <span className="text-white/10">·</span>
                <span className="text-xs text-white/30">{m.department}</span>
              </div>
            </div>
            <button className="bg-[#7F77DD] hover:bg-[#6860cc] text-white text-sm px-4 py-2 rounded-lg transition-colors">
              Message
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Open tasks", value: m.tasks },
            { label: "Department", value: m.department },
            { label: "Joined", value: m.joined },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/5 rounded-xl p-4">
              <p className="text-lg font-medium text-white">{stat.value}</p>
              <p className="text-xs text-white/30 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div className="bg-white/5 border border-white/5 rounded-xl p-4">
          <h3 className="text-sm font-medium text-white mb-3">Contact</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm">📧</span>
            <span className="text-sm text-white/50">{m.email}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-white">People</h1>
          <p className="text-white/40 text-sm mt-1">{members.length} members in this workspace</p>
        </div>
        <button className="bg-[#7F77DD] hover:bg-[#6860cc] text-white text-sm px-4 py-2 rounded-lg transition-colors">
          + Invite member
        </button>
      </div>

      {/* Search and filter */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or role…"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#7F77DD] transition-colors"
        />
        <div className="flex gap-2">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setFilter(dept)}
              className={`text-xs px-3 py-1.5 rounded-lg capitalize transition-colors ${
                filter === dept
                  ? "bg-[#7F77DD] text-white"
                  : "bg-white/5 text-white/40 hover:text-white"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Members grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((member) => (
          <div
            key={member.id}
            onClick={() => setSelectedMember(member)}
            className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl cursor-pointer transition-all hover:bg-white/8"
          >
            <div className="relative flex-shrink-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-white"
                style={{ background: member.color }}
              >
                {member.avatar}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0f0f10] ${statusColor[member.status]}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{member.name}</p>
              <p className="text-xs text-white/40 truncate">{member.role}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xs bg-white/5 text-white/30 px-2 py-0.5 rounded-full">{member.department}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}