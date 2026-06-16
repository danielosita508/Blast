import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import Tasks from "./pages/Tasks"
import Channels from "./pages/Channels"
import Meetings from "./pages/Meetings"
import MeetingRoom from "./pages/MeetingRoom"
import DirectMessages from "./pages/Direct messages"
import AIPanel from "./components/AIPanel"
import AIAssistant from "./pages/AIAssistant"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Projects from "./pages/Projects"
import Notifications from "./pages/Notifications"
import Settings from "./pages/Settings"
import People from "./pages/People"
import Files from "./pages/Files"

export default function App() {
  const [activePage, setActivePage] = useState("dashboard")
  const [authPage, setAuthPage] = useState("login")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [inMeeting, setInMeeting] = useState(false)

  const renderPage = () => {
    if (activePage === "dashboard") return <Dashboard />
    if (activePage === "tasks") return <Tasks />
    if (activePage === "meetingroom" || inMeeting) return <MeetingRoom onLeave={() => { setInMeeting(false); setActivePage("meetings") }} />
    if (activePage === "channels") return <Channels />
    if (activePage === "projects") return <Projects />
    if (activePage === "meetings") return <Meetings onJoin={() => setActivePage("meetingroom")} />
    if (activePage === "messages") return <DirectMessages />
    if (activePage === "ai") return <AIAssistant />
    if (activePage === "notifications") return <Notifications />
    if (activePage === "settings") return <Settings />
    if (activePage === "people") return <People />
    if (activePage === "files") return <Files />

    return <Dashboard />
  }

  if (!isLoggedIn) {
    return authPage === "login"
      ? <Login onLogin={() => setIsLoggedIn(true)} onSwitch={() => setAuthPage("signup")} />
      : <Signup onSignup={() => setIsLoggedIn(true)} onSwitch={() => setAuthPage("login")} />
  }
  
  return (
    <div className="flex h-screen w-screen bg-[#0f0f10] text-white overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
      <AIPanel />
    </div>
  )
}
