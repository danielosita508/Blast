import { useState } from "react"

const allTasks = [
  { id: 1, title: "Finish Blast dashboard UI", tag: "Design", due: "Today", priority: "high", done: false },
  { id: 2, title: "Write IT weekly progress report", tag: "IT", due: "Fri Jun 7", priority: "high", done: false },
  { id: 3, title: "Set up Supabase auth", tag: "Dev", due: "No due date", priority: "med", done: false },
  { id: 4, title: "Research Daily.co pricing", tag: "Research", due: "Next week", priority: "low", done: false },
  { id: 5, title: "Design onboarding flow", tag: "Design", due: "Jun 10", priority: "med", done: false },
  { id: 6, title: "Write product requirements doc", tag: "Product", due: "Jun 12", priority: "low", done: false },
  { id: 7, title: "Set up GitHub repo", tag: "Dev", due: "Done", priority: "low", done: true },
]

const priorityDot = { high: "bg-red-500", med: "bg-yellow-400", low: "bg-green-500" }
const priorityLabel = { high: "High", med: "Medium", low: "Low" }

export default function Tasks() {
  const [tasks, setTasks] = useState(allTasks)
  const [filter, setFilter] = useState("all")
  const [newTask, setNewTask] = useState("")

  const toggleDone = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const addTask = () => {
    if (!newTask.trim()) return
    setTasks([...tasks, {
      id: tasks.length + 1,
      title: newTask,
      tag: "General",
      due: "No due date",
      priority: "low",
      done: false
    }])
    setNewTask("")
  }

  const filtered = tasks.filter(t => {
    if (filter === "active") return !t.done
    if (filter === "done") return t.done
    return true
  })

  return (
    <div className="p-8 max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-white">Tasks</h1>
          <p className="text-white/40 text-sm mt-1">{tasks.filter(t => !t.done).length} remaining · {tasks.filter(t => t.done).length} completed</p>
        </div>
      </div>

      {/* Add task */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a new task… press Enter"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#7F77DD] transition-colors"
        />
        <button
          onClick={addTask}
          className="bg-[#7F77DD] hover:bg-[#6860cc] text-white text-sm px-4 py-2.5 rounded-lg transition-colors"
        >
          + Add
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {["all", "active", "done"].map((f) => (
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
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-2">
        {filtered.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleDone(task.id)}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer border transition-all ${
              task.done
                ? "bg-white/3 border-white/5 opacity-50"
                : "bg-white/5 border-white/5 hover:border-white/10"
            }`}
          >
            {/* Checkbox */}
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              task.done ? "bg-[#7F77DD] border-[#7F77DD]" : "border-white/20"
            }`}>
              {task.done && <span className="text-white text-[10px]">✓</span>}
            </div>

            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${priorityDot[task.priority]}`} />

            <span className={`flex-1 text-sm ${task.done ? "line-through text-white/30" : "text-white"}`}>
              {task.title}
            </span>

            <span className="text-[11px] bg-white/10 text-white/50 px-2 py-0.5 rounded-full">{task.tag}</span>
            <span className="text-[11px] text-white/30 min-w-16 text-right">{task.due}</span>
          </div>
        ))}
      </div>

    </div>
  )
}