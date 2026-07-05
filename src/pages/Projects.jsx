import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

const colors = ["#7F77DD", "#378ADD", "#1D9E75", "#EF9F27", "#E24B4A", "#EC4899"]

export default function Projects({ user }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeProject, setActiveProject] = useState(null)
  const [projectTasks, setProjectTasks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [newProject, setNewProject] = useState({ name: "", description: "", color: "#7F77DD", due_date: "" })
  const [newTask, setNewTask] = useState("")
  const [dragging, setDragging] = useState(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (activeProject) fetchProjectTasks(activeProject.id)
  }, [activeProject])

  const fetchProjects = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
    if (!error) setProjects(data)
    setLoading(false)
  }

  const fetchProjectTasks = async (projectId) => {
    const { data, error } = await supabase
      .from("project_tasks")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true })
    if (!error) setProjectTasks(data)
  }

  const createProject = async () => {
    if (!newProject.name.trim()) return
    const { data, error } = await supabase
      .from("projects")
      .insert({
        name: newProject.name,
        description: newProject.description,
        color: newProject.color,
        due_date: newProject.due_date || null,
        created_by: user.id,
        status: "active",
        progress: 0,
      })
      .select()
    if (!error) {
      setProjects([data[0], ...projects])
      setNewProject({ name: "", description: "", color: "#7F77DD", due_date: "" })
      setShowForm(false)
    }
  }

  const deleteProject = async (id) => {
    const { error } = await supabase.from("projects").delete().eq("id", id)
    if (!error) setProjects(projects.filter(p => p.id !== id))
  }

  const addProjectTask = async (status = "todo") => {
    if (!newTask.trim() || !activeProject) return
    const { data, error } = await supabase
      .from("project_tasks")
      .insert({
        project_id: activeProject.id,
        title: newTask,
        status,
        priority: "med",
        tag: "General",
      })
      .select()
    if (!error) {
      setProjectTasks([...projectTasks, data[0]])
      setNewTask("")
      updateProjectProgress(activeProject.id, [...projectTasks, data[0]])
    }
  }

  const moveTask = async (taskId, newStatus) => {
    const { error } = await supabase
      .from("project_tasks")
      .update({ status: newStatus })
      .eq("id", taskId)
    if (!error) {
      const updated = projectTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
      setProjectTasks(updated)
      updateProjectProgress(activeProject.id, updated)
    }
  }

  const deleteProjectTask = async (taskId) => {
    const { error } = await supabase.from("project_tasks").delete().eq("id", taskId)
    if (!error) {
      const updated = projectTasks.filter(t => t.id !== taskId)
      setProjectTasks(updated)
      updateProjectProgress(activeProject.id, updated)
    }
  }

  const updateProjectProgress = async (projectId, tasks) => {
    const total = tasks.length
    const done = tasks.filter(t => t.status === "done").length
    const progress = total === 0 ? 0 : Math.round((done / total) * 100)
    await supabase.from("projects").update({ progress }).eq("id", projectId)
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, progress } : p))
    if (activeProject?.id === projectId) {
      setActiveProject(prev => ({ ...prev, progress }))
    }
  }

  const priorityDot = { high: "bg-red-500", med: "bg-yellow-400", low: "bg-green-500" }

  if (activeProject) {
    const columns = [
      { key: "todo", label: "To Do", color: "text-white/40" },
      { key: "inprogress", label: "In Progress", color: "text-yellow-400" },
      { key: "done", label: "Done", color: "text-green-400" },
    ]

    return (
      <div className="flex flex-col h-full">
        <div className="px-8 py-5 border-b border-white/5 flex items-center gap-4">
          <button onClick={() => setActiveProject(null)} className="text-white/30 hover:text-white text-sm transition-colors">
            ← Projects
          </button>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: activeProject.color }} />
          <h1 className="text-lg font-medium text-white">{activeProject.name}</h1>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-white/30">{activeProject.progress}% complete</span>
            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${activeProject.progress}%`, background: activeProject.color }} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto p-6">
          <div className="flex gap-4 h-full min-w-max">
            {columns.map((col) => (
              <div
                key={col.key}
                className="w-72 flex flex-col"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragging) moveTask(dragging.id, col.key)
                  setDragging(null)
                }}
              >
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className={`text-xs font-medium ${col.color}`}>{col.label}</span>
                  <span className="text-[10px] bg-white/10 text-white/40 px-1.5 py-0.5 rounded-full">
                    {projectTasks.filter(t => t.status === col.key).length}
                  </span>
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  {projectTasks.filter(t => t.status === col.key).map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => setDragging(task)}
                      className="bg-white/5 border border-white/5 hover:border-white/10 rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all group"
                    >
                      <div className="flex items-start gap-2 mb-3">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${priorityDot[task.priority] || "bg-white/20"}`} />
                        <p className="text-sm text-white leading-snug flex-1">{task.title}</p>
                        <button
                          onClick={() => deleteProjectTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
                        >
                          ×
                        </button>
                      </div>
                      <span className="text-[10px] bg-white/10 text-white/40 px-2 py-0.5 rounded-full">
                        {task.tag}
                      </span>
                    </div>
                  ))}

                  <div className="border border-dashed border-white/10 rounded-xl p-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={col.key === "todo" ? newTask : ""}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addProjectTask(col.key)}
                        placeholder="+ Add task"
                        className="flex-1 bg-transparent text-xs text-white placeholder-white/20 outline-none"
                      />
                    </div>
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-white">Projects</h1>
          <p className="text-white/40 text-sm mt-1">
            {projects.filter(p => p.status === "active").length} active projects
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#7F77DD] hover:bg-[#6860cc] text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          + New project
        </button>
      </div>

      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-medium text-white mb-4">Create a project</h3>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Project name</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                placeholder="Blast Mobile App"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#7F77DD] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Description</label>
              <input
                type="text"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="What is this project about?"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#7F77DD] transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-white/50 mb-1.5">Due date</label>
                <input
                  type="date"
                  value={newProject.due_date}
                  onChange={(e) => setNewProject({ ...newProject, due_date: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-[#7F77DD] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Color</label>
                <div className="flex gap-2 mt-1">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setNewProject({ ...newProject, color: c })}
                      className={`w-6 h-6 rounded-full transition-all ${newProject.color === c ? "ring-2 ring-white ring-offset-1 ring-offset-[#0f0f10]" : ""}`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={createProject} className="bg-[#7F77DD] hover:bg-[#6860cc] text-white text-sm px-4 py-2 rounded-lg transition-colors">
                Create project
              </button>
              <button onClick={() => setShowForm(false)} className="bg-white/5 hover:bg-white/10 text-white/50 text-sm px-4 py-2 rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-[#7F77DD] border-t-transparent animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl mb-2">📁</p>
          <p className="text-sm text-white/30">No projects yet — create your first one above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setActiveProject(project)}
              className="bg-white/5 border border-white/5 hover:border-white/10 rounded-xl p-5 cursor-pointer transition-all hover:bg-white/8 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: project.color }} />
                  <h3 className="text-sm font-medium text-white">{project.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    project.status === "done"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}>
                    {project.status === "done" ? "Completed" : "Active"}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteProject(project.id) }}
                    className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all text-lg"
                  >
                    ×
                  </button>
                </div>
              </div>

              {project.description && (
                <p className="text-xs text-white/40 mb-4 leading-relaxed">{project.description}</p>
              )}

              <div className="mb-3">
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

              {project.due_date && (
                <p className="text-xs text-white/30">Due {project.due_date}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}