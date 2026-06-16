import { useState } from "react"


const meetings = [
  {
    id: 1,
    title: "IT Supervisor Standup",
    time: "10:00 AM",
    date: "Today",
    duration: "30 mins",
    participants: ["OD", "EM", "AM"],
    status: "upcoming",
  },
  {
    id: 2,
    title: "Blast Frontend Review",
    time: "2:00 PM",
    date: "Today",
    duration: "1 hour",
    participants: ["OD", "AM", "TK"],
    status: "upcoming",
  },
  {
    id: 3,
    title: "Product Sync · Design Team",
    time: "4:30 PM",
    date: "Today",
    duration: "45 mins",
    participants: ["OD", "EM"],
    status: "upcoming",
  },
  {
    id: 4,
    title: "Weekly Team Retrospective",
    time: "11:00 AM",
    date: "Yesterday",
    duration: "1 hour",
    participants: ["OD", "EM", "AM", "TK"],
    status: "done",
    summary: "Discussed sprint progress, identified 2 blockers, agreed on new task assignment process.",
  },
  {
    id: 5,
    title: "Investor Update Call",
    time: "3:00 PM",
    date: "Mon Jun 2",
    duration: "30 mins",
    participants: ["OD", "EM"],
    status: "done",
    summary: "Presented Blast MVP progress. Investors asked about AI roadmap and monetization.",
  },
]

export default function Meetings({ onJoin }) {
  const [activeTab, setActiveTab] = useState("upcoming")

  const filtered = meetings.filter(m =>
    activeTab === "upcoming" ? m.status === "upcoming" : m.status === "done"
  )

  return (
    <div className="p-8 max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-white">Meetings</h1>
          <p className="text-white/40 text-sm mt-1">3 meetings scheduled today</p>
        </div>
        <button className="bg-[#7F77DD] hover:bg-[#6860cc] text-white text-sm px-4 py-2 rounded-lg transition-colors">
          + New meeting
        </button>
      </div>

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
      <div className="flex flex-col gap-3">
        {filtered.map((meeting) => (
          <div
            key={meeting.id}
            className="bg-white/5 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">

                {/* Title and time */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                  <h3 className="text-sm font-medium text-white">{meeting.title}</h3>
                </div>

                <div className="flex items-center gap-4 ml-5 mb-3">
                  <span className="text-xs text-white/40">{meeting.date} · {meeting.time}</span>
                  <span className="text-xs text-white/40">{meeting.duration}</span>
                </div>

                {/* Participants */}
                <div className="flex items-center gap-1.5 ml-5">
                  {meeting.participants.map((p) => (
                    <div
                      key={p}
                      className="w-6 h-6 rounded-full bg-[#7F77DD] flex items-center justify-center text-[10px] font-medium text-white"
                    >
                      {p}
                    </div>
                  ))}
                  <span className="text-xs text-white/30 ml-1">{meeting.participants.length} people</span>
                </div>

                {/* AI Summary for past meetings */}
                {meeting.summary && (
                  <div className="mt-3 ml-5 bg-white/5 border-l-2 border-[#7F77DD] rounded-r-lg px-3 py-2">
                    <p className="text-[10px] text-[#7F77DD] font-medium mb-1">✦ AI Summary</p>
                    <p className="text-xs text-white/50 leading-relaxed">{meeting.summary}</p>
                  </div>
                )}

              </div>

              {/* Action button */}
              {meeting.status === "upcoming" && (
                <button
                  onClick={onJoin}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded-lg transition-colors flex-shrink-0">
                  Join call
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}