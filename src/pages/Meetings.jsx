import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

export default function Meetings({ onJoin, user }) {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [showForm, setShowForm] = useState(false)
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: "",
    time: "",
    duration: "30 mins",
  })

  useEffect(() => {
    fetchMeetings()
  }, [])

  const fetchMeetings = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.log("Error fetching meetings:", error)
    } else {
      setMeetings(data)
    }
    setLoading(false)
  }

  const createMeeting = async () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time) return

    const { data, error } = await supabase
      .from("meetings")
      .insert({
        title: newMeeting.title,
        date: newMeeting.date,
        time: newMeeting.time,
        duration: newMeeting.duration,
        created_by: user.id,
        status: "upcoming",
      })
      .select()

    if (error) {
      console.log("Error creating meeting:", error)
    } else {
      setMeetings([data[0], ...meetings])
      setNewMeeting({ title: "", date: "", time: "", duration: "30 mins" })
      setShowForm(false)
    }
  }

  const deleteMeeting = async (id) => {
    const { error } = await supabase
      .from("meetings")
      .delete()
      .eq("id", id)

    if (!error) {
      setMeetings(meetings.filter(m => m.id !== id))
    }
  }

  const filtered = meetings.filter(m =>
    activeTab === "upcoming" ? m.status === "upcoming" : m.status === "done"
  )

  return (
    <div className="p-8 max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-white">Meetings</h1>
          <p className="text-white/40 text-sm mt-1">
            {meetings.filter(m => m.status === "upcoming").length} upcoming meetings
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#7F77DD] hover:bg-[#6860cc] text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          + New meeting
        </button>
      </div>

      {/* New meeting form */}
      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-medium text-white mb-4">Schedule a meeting</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="col-span-2">
              <label className="block text-xs text-white/50 mb-1.5">Meeting title</label>
              <input
                type="text"
                value={newMeeting.title}
                onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                placeholder="Weekly team standup"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#7F77DD] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Date</label>
              <input
                type="date"
                value={newMeeting.date}
                onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-[#7F77DD] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Time</label>
              <input
                type="time"
                value={newMeeting.time}
                onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-[#7F77DD] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Duration</label>
              <select
                value={newMeeting.duration}
                onChange={(e) => setNewMeeting({ ...newMeeting, duration: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-[#7F77DD] transition-colors"
              >
                <option value="15 mins">15 mins</option>
                <option value="30 mins">30 mins</option>
                <option value="45 mins">45 mins</option>
                <option value="1 hour">1 hour</option>
                <option value="1.5 hours">1.5 hours</option>
                <option value="2 hours">2 hours</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={createMeeting}
              className="bg-[#7F77DD] hover:bg-[#6860cc] text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Schedule meeting
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-white/5 hover:bg-white/10 text-white/50 text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {["upcoming", "past"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs px-3 py-1.5 rounded-lg capitalize transition-colors ${
              activeTab === tab
                ? "bg-[#7F77DD] text-white"
                : "bg-white/5 text-white/40 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Meeting cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-[#7F77DD] border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl mb-2">📅</p>
          <p className="text-sm text-white/30">
            {activeTab === "upcoming"
              ? "No upcoming meetings — schedule one above"
              : "No past meetings yet"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white/5 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                    <h3 className="text-sm font-medium text-white">{meeting.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 ml-5 mb-3">
                    <span className="text-xs text-white/40">{meeting.date} · {meeting.time}</span>
                    <span className="text-xs text-white/40">{meeting.duration}</span>
                  </div>

                  {/* AI Summary for past meetings */}
                  {meeting.summary && (
                    <div className="mt-3 ml-5 bg-white/5 border-l-2 border-[#7F77DD] rounded-r-lg px-3 py-2">
                      <p className="text-[10px] text-[#7F77DD] font-medium mb-1">✦ AI Summary</p>
                      <p className="text-xs text-white/50 leading-relaxed">{meeting.summary}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {meeting.status === "upcoming" && (
                   <button
                       onClick={() => onJoin(meeting)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded-lg transition-colors"
                  >
                      Join call
                    </button>
                  )}
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}