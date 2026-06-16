import { useState } from "react"

const projectsData = [
  {
    id: 1,
    name: "Blast Web App",
    description: "Building the core workspace platform",
    color: "#7F77DD",
    progress: 65,
    members: ["OD", "EM", "AM"],
    tasks: { todo: 4, inprogress: 3, done: 8 },
    dueDate: "Jun 30",
    status: "active",
  },
  {
    id: 2,
    name: "AI Assistant Integration",
    description: "Connecting OpenAI to the workspace",
    color: "#378ADD",
    progress: 30,
    members: ["OD", "TK"],
    tasks: { todo: 6, inprogress: 2, done: 3 },
    dueDate: "Jul 15",
    status: "active",
  },
  {
    id: 3,
    name: "Mobile App",
    description: "React Native version of Blast",
    color: "#1D9E75",
    progress: 10,
    members: ["OD", "EM", "TK", "AM"],
    tasks: { todo: 12, inprogress: 1, done: 1 },
    dueDate: "Sep 1",
    status: "active",
  },
  {
    id: 4,
    name: "Marketing Website",
    description: "Landing page and product marketing",
    color: "#EF9F27",
    progress: 100,
    members: ["AM", "EM"],
    tasks: { todo: 0, inprogress: 0, done: 10 },
    dueDate: "May 1",
    status: "done",
  },
]

const kanbanData = {
  todo: [
    { id: 1, title: "Set up Supabase auth", tag: "Dev", priority: "high" },
    { id: 2, title: "Design settings page", tag: "Design", priority: "med" },
    { id: 3, title: "Write API documentation", tag: "Docs", priority: "low" },
    { id: 4, title: "Set up Daily.co integration", tag: "Dev", priority: "high" },
  ],
  inprogress: [
    { id: 5, title: "Build Dashboard UI", tag: "Dev", priority: "high" },
    { id: 6, title: "AI briefing card", tag: "AI", priority: "high" },
    { id: 7, title: "Channels realtime messaging", tag: "Dev", priority: "med" },
  ],
  done: [
    { id: 8, title: "Project setup with Vite", tag: "Dev", priority: "low" },
    { id: 9, title: "Tailwind CSS configuration", tag: "Dev", priority: "low" },
    { id: 10, title: "Sidebar navigation", tag: "Dev", priority: "med" },
    { id: 11, title: "Login and Signup pages", tag: "Design", priority: "med" },
  ],
}

const priorityDot = { high: "bg-red-500", med: "bg-yellow-400", low: "bg-green-500" }

export default function Projects() {
  const [view, setView] = useState("list")
  const [activeProject, setActiveProject] = useState(null)
  const [kanban, setKanban] = useState(kanbanData)
  const [dragging, setDragging] = useState(null)

  const handleDragStart = (card, col) => setDragging({ card, col })

  const handleDrop = (targetCol) => {
    if (!dragging || dragging.col === targetCol) return
    const newKanban = { ...kanban }
    newKanban[dragging.col] = newKanban[dragging.col].filter(c => c.id !== dragging.card.id)
    newKanban[targetCol] = [...newKanban[targetCol], dragging.card]
    setKanban(newKanban)
    setDragging(null)
  }

  if (activeProject) {
    return (
      <div className="flex flex-col h-full">
        {/* Kanban header */}
        <div className="px-8 py-5 border-b border-white/5 flex items-center gap-4">
          <button
            onClick={() => setActiveProject(null)}
            className="text-white/30 hover:text-white text-sm transition-colors"
          >
            ← Projects
          </button>
          <div className="w-2 h-2 rounded-full" style={{ background: activeProject.color }} />
          <h1 className="text-lg font-medium text-white">{activeProject.name}</h1>
          <div className="ml-auto flex items-center gap-2">
            <button className="text-xs bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
              + Add task
            </button>
          </div>
        </div>

        {/* Kanban board */}
        <div className="flex-1 overflow-x-auto p-6">
          <div className="flex gap-4 h-full min-w-max">
            {[
              { key: "todo", label: "To Do", color: "text-white/40" },
              { key: "inprogress", label: "In Progress", color: "text-yellow-400" },
              { key: "done", label: "Done", color: "text-green-400" },
            ].map((col) => (
              <div
                key={col.key}
                className="w-72 flex flex-col"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(col.key)}
              >
                {/* Column header */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className={`text-xs font-medium ${col.color}`}>{col.label}</span>
                  <span className="text-[10px] bg-white/10 text-white/40 px-1.5 py-0.5 rounded-full">
                    {kanban[col.key].length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2 flex-1">
                  {kanban[col.key].map((card) => (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={() => handleDragStart(card, col.key)}
                      className="bg-white/5 border border-white/5 hover:border-white/10 rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all hover:bg-white/8"
                    >
                      <div className="flex items-start gap-2 mb-3">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${priorityDot[card.priority]}`} />
                        <p className="text-sm text-white leading-snug">{card.title}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-white/10 text-white/40 px-2 py-0.5 rounded-full">
                          {card.tag}
                        </span>
                        <div className="w-5 h-5 rounded-full bg-[#7F77DD] flex items-center justify-center text-[8px] text-white">
                          OD
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Drop zone */}
                  <div className="border border-dashed border-white/10 rounded-xl p-3 text-center">
                    <span className="text-xs text-white/20">Drop here</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-white">Projects</h1>
          <p className="text-white/40 text-sm mt-1">{projectsData.filter(p => p.status === "active").length} active projects</p>
        </div>
        <button className="bg-[#7F77DD] hover:bg-[#6860cc] text-white text-sm px-4 py-2 rounded-lg transition-colors">
          + New project
        </button>
      </div>

      {/* Project cards */}
      <div className="grid grid-cols-2 gap-4">
        {projectsData.map((project) => (
          <div
            key={project.id}
            onClick={() => setActiveProject(project)}
            className="bg-white/5 border border-white/5 hover:border-white/10 rounded-xl p-5 cursor-pointer transition-all hover:bg-white/8"
          >
            {/* Top */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full" style={{ background: project.color }} />
                <h3 className="text-sm font-medium text-white">{project.name}</h3>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                project.status === "done"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-blue-500/20 text-blue-400"
              }`}>
                {project.status === "done" ? "Completed" : "Active"}
              </span>
            </div>

            <p className="text-xs text-white/40 mb-4 leading-relaxed">{project.description}</p>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-white/30">Progress</span>
                <span className="text-xs text-white/50">{project.progress}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${project.progress}%`, background: project.color }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {project.members.map((m) => (
                  <div
                    key={m}
                    className="w-6 h-6 rounded-full bg-[#7F77DD] flex items-center justify-center text-[9px] font-medium text-white -ml-1 first:ml-0 border border-[#0f0f10]"
                  >
                    {m}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-white/30">
                <span>✓ {project.tasks.done}/{Object.values(project.tasks).reduce((a,b) => a+b, 0)}</span>
                <span>Due {project.dueDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}