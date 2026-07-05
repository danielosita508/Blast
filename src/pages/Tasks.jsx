import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

const priorityDot = { high: "bg-red-500", med: "bg-yellow-400", low: "bg-green-500" }

export default function Tasks({ user }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [newTask, setNewTask] = useState("")
  const [newPriority, setNewPriority] = useState("med")

  // Fetch tasks from Supabase when page loads
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.log("Error fetching tasks:", error)
    } else {
      setTasks(data)
    }
    setLoading(false)
  }

  const addTask = async () => {
    if (!newTask.trim()) return

    const task = {
      user_id: user.id,
      title: newTask,
      tag: "General",
      priority: newPriority,
      due_date: null,
      done: false,
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert(task)
      .select()

    if (error) {
      console.log("Error adding task:", error)
    } else {
      setTasks([data[0], ...tasks])
      setNewTask("")
    }
  }

  const toggleDone = async (id, currentDone) => {
    const { error } = await supabase
      .from("tasks")
      .update({ done: !currentDone })
      .eq("id", id)

    if (!error) {
      setTasks(tasks.map(t => t.id === id ? { ...t, done: !currentDone } : t))
    }
  }

  const deleteTask = async (id) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)

    if (!error) {
      setTasks(tasks.filter(t => t.id !== id))
    }
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
          <p className="text-white/40 text-sm mt-1">
            {tasks.filter(t => !t.done).length} remaining · {tasks.filter(t => t.done).length} completed
          </p>
        </div>
      </div>

      {/* Add task */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a new task… press Enter"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#7F77DD] transition-colors"
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#7F77DD] transition-colors"
        >
          <option value="high" color="white">High</option>
          <option value="med">Medium</option>
          <option value="low">Low</option>
        </select>
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

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-[#7F77DD] border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl mb-2">✓</p>
          <p className="text-sm text-white/30">
            {filter === "done" ? "No completed tasks yet" : "No tasks yet — add one above"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 border transition-all group ${
                task.done
                  ? "bg-white/3 border-white/5 opacity-50"
                  : "bg-white/5 border-white/5 hover:border-white/10"
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleDone(task.id, task.done)}
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  task.done ? "bg-[#7F77DD] border-[#7F77DD]" : "border-white/20 hover:border-[#7F77DD]"
                }`}
              >
                {task.done && <span className="text-white text-[10px]">✓</span>}
              </button>

              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${priorityDot[task.priority] || "bg-white/20"}`} />

              <span className={`flex-1 text-sm ${task.done ? "line-through text-white/30" : "text-white"}`}>
                {task.title}
              </span>

              <span className="text-[11px] bg-white/10 text-white/50 px-2 py-0.5 rounded-full">
                {task.tag}
              </span>

              {task.due_date && (
                <span className="text-[11px] text-white/30">{task.due_date}</span>
              )}

              {/* Delete button — shows on hover */}
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all text-sm ml-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}