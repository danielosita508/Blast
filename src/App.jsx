import { useState, useEffect } from "react"
import { supabase } from "./supabaseClient"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import Tasks from "./pages/Tasks"
import Channels from "./pages/Channels"
import Meetings from "./pages/Meetings"
import AIPanel from "./components/AIPanel"
import Login from "./pages/login"
import Signup from "./pages/Signup"
import MeetingRoom from "./pages/MeetingRoom"
import DirectMessages from "./pages/DirectMessages"
import Projects from "./pages/Projects"
import AIAssistant from "./pages/AIAssistant"
import Notifications from "./pages/Notifications"
import Settings from "./pages/Settings"
import People from "./pages/People"
import Files from "./pages/Files"

export default function App() {
  const [activePage, setActivePage] = useState("dashboard")
  const [authPage, setAuthPage] = useState("login")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inMeeting, setInMeeting] = useState(false)
  const [currentMeeting, setCurrentMeeting] = useState(null)
  const [activeMeeting, setActiveMeeting] = useState(null)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const renderPage = () => {
    if (activePage === "dashboard") return <Dashboard user={user} />
    if (activePage === "tasks") return <Tasks user={user} />
    if (activePage === "channels") return <Channels />
    if (activePage === "meetings") return <Meetings onJoin={(meeting) => { setCurrentMeeting(meeting); setActivePage("meetingroom") }} user={user} />
    if (activePage === "meetingroom" || inMeeting) return <MeetingRoom onLeave={() => { setInMeeting(false); setActivePage("meetings") }} />
    if (activePage === "projects") return <Projects user={user}/>
    if (activePage === "ai") return <AIAssistant user={user} />
    if (activePage === "notifications") return <Notifications />
    if (activePage === "settings") return <Settings user={user} />
    if (activePage === "people") return <People />
    if (activePage === "files") return <Files />
    return <Dashboard />
  }

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-[#0f0f10] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#7F77DD] animate-pulse" />
          <p className="text-white/30 text-sm">Loading Blast…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return authPage === "login"
      ? <Login onLogin={(u) => setUser(u)} onSwitch={() => setAuthPage("signup")} />
      : <Signup onSignup={(u) => setUser(u)} onSwitch={() => setAuthPage("login")} />
  }

  return (
    <div className="flex h-screen w-screen bg-[#0f0f10] text-white overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={setActivePage} user={user} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
      {user && <AIPanel user={user} />}
    </div>
  )
}
