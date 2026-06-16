import { useState } from "react"

const files = [
  { id: 1, name: "Blast Dashboard Design.fig", type: "figma", size: "4.2 MB", channel: "#design", uploadedBy: "Emmanuel", avatar: "EM", date: "Today", color: "#7F77DD" },
  { id: 2, name: "IT Progress Report - Week 3.pdf", type: "pdf", size: "1.1 MB", channel: "#general", uploadedBy: "Osita Daniel", avatar: "OD", date: "Today", color: "#E24B4A" },
  { id: 3, name: "Blast Product Requirements.docx", type: "doc", size: "890 KB", channel: "#product", uploadedBy: "Amaka", avatar: "AM", date: "Yesterday", color: "#378ADD" },
  { id: 4, name: "Q2 Roadmap.xlsx", type: "sheet", size: "2.3 MB", channel: "#product", uploadedBy: "Amaka", avatar: "AM", date: "Yesterday", color: "#1D9E75" },
  { id: 5, name: "Blast Logo Assets.zip", type: "zip", size: "8.7 MB", channel: "#design", uploadedBy: "Emmanuel", avatar: "EM", date: "Jun 12", color: "#EF9F27" },
  { id: 6, name: "Backend Architecture.png", type: "image", size: "3.4 MB", channel: "#development", uploadedBy: "Tunde", avatar: "TK", date: "Jun 11", color: "#7F77DD" },
  { id: 7, name: "Meeting Recording - Sprint Review.mp4", type: "video", size: "124 MB", channel: "#meetings", uploadedBy: "Osita Daniel", avatar: "OD", date: "Jun 10", color: "#E24B4A" },
  { id: 8, name: "Competitor Analysis.pdf", type: "pdf", size: "2.8 MB", channel: "#product", uploadedBy: "Amaka", avatar: "AM", date: "Jun 9", color: "#E24B4A" },
]

const typeIcons = {
  figma: "🎨",
  pdf: "📄",
  doc: "📝",
  sheet: "📊",
  zip: "🗜️",
  image: "🖼️",
  video: "🎥",
  other: "📎",
}

export default function Files() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [view, setView] = useState("list")

  const types = ["all", "pdf", "doc", "image", "figma", "video"]

  const filtered = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase())
    const matchesType = filter === "all" || f.type === filter
    return matchesSearch && matchesType
  })

  const totalSize = files.reduce((acc, f) => {
    const num = parseFloat(f.size)
    return acc + num
  }, 0).toFixed(1)

  return (
    <div className="p-8 max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-white">Files</h1>
          <p className="text-white/40 text-sm mt-1">{files.length} files · {totalSize} MB total</p>
        </div>
        <button className="bg-[#7F77DD] hover:bg-[#6860cc] text-white text-sm px-4 py-2 rounded-lg transition-colors">
          + Upload file
        </button>
      </div>

      {/* Search and filters */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search files…"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#7F77DD] transition-colors"
        />
        <div className="flex gap-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`text-xs px-3 py-1.5 rounded-lg capitalize transition-colors ${
                filter === t
                  ? "bg-[#7F77DD] text-white"
                  : "bg-white/5 text-white/40 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setView("list")}
            className={`px-2 py-1 rounded text-xs transition-colors ${view === "list" ? "bg-white/10 text-white" : "text-white/30 hover:text-white"}`}
          >
            ☰
          </button>
          <button
            onClick={() => setView("grid")}
            className={`px-2 py-1 rounded text-xs transition-colors ${view === "grid" ? "bg-white/10 text-white" : "text-white/30 hover:text-white"}`}
          >
            ⊞
          </button>
        </div>
      </div>

      {/* File list */}
      {view === "list" ? (
        <div className="flex flex-col gap-2">
          {/* Table header */}
          <div className="flex items-center gap-4 px-4 py-2 text-xs text-white/30">
            <span className="flex-1">Name</span>
            <span className="w-24">Uploaded by</span>
            <span className="w-24">Channel</span>
            <span className="w-16 text-right">Size</span>
            <span className="w-20 text-right">Date</span>
          </div>

          {filtered.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-4 px-4 py-3 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl cursor-pointer transition-all hover:bg-white/8"
            >
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                style={{ background: file.color + "20" }}
              >
                {typeIcons[file.type] || typeIcons.other}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{file.name}</p>
              </div>

              {/* Uploaded by */}
              <div className="w-24 flex items-center gap-1.5 flex-shrink-0">
                <div className="w-5 h-5 rounded-full bg-[#7F77DD] flex items-center justify-center text-[9px] text-white">
                  {file.avatar}
                </div>
                <span className="text-xs text-white/40 truncate">{file.uploadedBy.split(" ")[0]}</span>
              </div>

              {/* Channel */}
              <span className="w-24 text-xs text-white/30 flex-shrink-0 truncate">{file.channel}</span>

              {/* Size */}
              <span className="w-16 text-xs text-white/30 text-right flex-shrink-0">{file.size}</span>

              {/* Date */}
              <span className="w-20 text-xs text-white/30 text-right flex-shrink-0">{file.date}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {filtered.map((file) => (
            <div
              key={file.id}
              className="bg-white/5 border border-white/5 hover:border-white/10 rounded-xl p-4 cursor-pointer transition-all hover:bg-white/8"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                style={{ background: file.color + "20" }}
              >
                {typeIcons[file.type] || typeIcons.other}
              </div>
              <p className="text-sm text-white truncate mb-1">{file.name}</p>
              <p className="text-xs text-white/30">{file.size} · {file.date}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}