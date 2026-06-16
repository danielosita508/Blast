import { useState } from "react"

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile")
  const [profile, setProfile] = useState({
    name: "Osita Daniel",
    email: "osita@blast.app",
    role: "Product Manager",
    status: "🟢 Active",
    bio: "Building Blast — an AI-powered workspace for modern teams.",
    timezone: "Africa/Lagos",
  })
  const [notifications, setNotifications] = useState({
    mentions: true,
    tasksDue: true,
    meetingReminders: true,
    aiSuggestions: true,
    projectUpdates: false,
    emailDigest: false,
  })
  const [appearance, setAppearance] = useState({
    theme: "dark",
    fontSize: "medium",
    sidebarCompact: false,
    aiPanelVisible: true,
  })
  const [saved, setSaved] = useState(false)

  const showSaved = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "appearance", label: "Appearance", icon: "🎨" },
    { id: "workspace", label: "Workspace", icon: "🏢" },
    { id: "integrations", label: "Integrations", icon: "🔗" },
    { id: "account", label: "Account", icon: "⚙️" },
  ]

  return (
    <div className="flex h-full">

      {/* Settings sidebar */}
      <div className="w-52 min-w-52 bg-white/3 border-r border-white/5 flex flex-col">
        <div className="px-4 py-4 border-b border-white/5">
          <h2 className="text-sm font-medium text-white">Settings</h2>
        </div>
        <div className="flex-1 px-2 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all mb-0.5 ${
                activeTab === tab.id
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings content */}
      <div className="flex-1 overflow-y-auto p-8 max-w-2xl">

        {/* Save toast */}
        {saved && (
          <div className="fixed top-4 right-4 bg-green-500 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50">
            ✓ Changes saved
          </div>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div>
            <h2 className="text-lg font-medium text-white mb-1">Profile</h2>
            <p className="text-sm text-white/40 mb-6">Manage your personal information</p>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-[#7F77DD] flex items-center justify-center text-xl font-medium text-white">
                OD
              </div>
              <div>
                <button className="text-sm text-[#7F77DD] hover:text-white transition-colors">
                  Change avatar
                </button>
                <p className="text-xs text-white/30 mt-1">JPG, PNG up to 2MB</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { label: "Full name", key: "name", type: "text" },
                { label: "Email address", key: "email", type: "email" },
                { label: "Role / Title", key: "role", type: "text" },
                { label: "Timezone", key: "timezone", type: "text" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs text-white/50 mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    value={profile[field.key]}
                    onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-[#7F77DD] transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs text-white/50 mb-1.5">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-[#7F77DD] transition-colors resize-none"
                />
              </div>

              <button
                onClick={showSaved}
                className="bg-[#7F77DD] hover:bg-[#6860cc] text-white text-sm px-4 py-2.5 rounded-lg transition-colors w-fit"
              >
                Save changes
              </button>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div>
            <h2 className="text-lg font-medium text-white mb-1">Notifications</h2>
            <p className="text-sm text-white/40 mb-6">Choose what you want to be notified about</p>

            <div className="flex flex-col gap-3">
              {[
                { key: "mentions", label: "Mentions", desc: "When someone @mentions you in a channel or DM" },
                { key: "tasksDue", label: "Task due dates", desc: "Reminders before tasks are due" },
                { key: "meetingReminders", label: "Meeting reminders", desc: "Alerts 10 minutes before a meeting starts" },
                { key: "aiSuggestions", label: "AI suggestions", desc: "Smart suggestions and reminders from Blast AI" },
                { key: "projectUpdates", label: "Project updates", desc: "When tasks are completed or projects change" },
                { key: "emailDigest", label: "Email digest", desc: "Daily summary of workspace activity via email" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl"
                >
                  <div>
                    <p className="text-sm text-white font-medium">{item.label}</p>
                    <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      notifications[item.key] ? "bg-[#7F77DD]" : "bg-white/10"
                    }`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                      notifications[item.key] ? "left-5" : "left-0.5"
                    }`} />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={showSaved} className="mt-6 bg-[#7F77DD] hover:bg-[#6860cc] text-white text-sm px-4 py-2.5 rounded-lg transition-colors">
              Save preferences
            </button>
          </div>
        )}

        {/* APPEARANCE */}
        {activeTab === "appearance" && (
          <div>
            <h2 className="text-lg font-medium text-white mb-1">Appearance</h2>
            <p className="text-sm text-white/40 mb-6">Customize how Blast looks for you</p>

            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-sm text-white font-medium mb-3">Theme</label>
                <div className="flex gap-3">
                  {["dark", "light", "system"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setAppearance({ ...appearance, theme: t })}
                      className={`flex-1 py-3 rounded-xl border text-sm capitalize transition-all ${
                        appearance.theme === t
                          ? "border-[#7F77DD] bg-[#7F77DD]/10 text-white"
                          : "border-white/10 text-white/40 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {t === "dark" ? "🌙" : t === "light" ? "☀️" : "💻"} {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-white font-medium mb-3">Font size</label>
                <div className="flex gap-3">
                  {["small", "medium", "large"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setAppearance({ ...appearance, fontSize: s })}
                      className={`flex-1 py-3 rounded-xl border text-sm capitalize transition-all ${
                        appearance.fontSize === s
                          ? "border-[#7F77DD] bg-[#7F77DD]/10 text-white"
                          : "border-white/10 text-white/40 hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { key: "sidebarCompact", label: "Compact sidebar", desc: "Show icons only in the sidebar" },
                  { key: "aiPanelVisible", label: "Show AI panel", desc: "Keep the AI assistant panel always visible" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                    <div>
                      <p className="text-sm text-white font-medium">{item.label}</p>
                      <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setAppearance({ ...appearance, [item.key]: !appearance[item.key] })}
                      className={`w-10 h-5 rounded-full transition-colors relative ${
                        appearance[item.key] ? "bg-[#7F77DD]" : "bg-white/10"
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                        appearance[item.key] ? "left-5" : "left-0.5"
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={showSaved} className="mt-6 bg-[#7F77DD] hover:bg-[#6860cc] text-white text-sm px-4 py-2.5 rounded-lg transition-colors">
              Save appearance
            </button>
          </div>
        )}

        {/* WORKSPACE */}
        {activeTab === "workspace" && (
          <div>
            <h2 className="text-lg font-medium text-white mb-1">Workspace</h2>
            <p className="text-sm text-white/40 mb-6">Manage your workspace settings and members</p>

            <div className="flex flex-col gap-4 mb-8">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Workspace name</label>
                <input defaultValue="Blast HQ" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-[#7F77DD] transition-colors" />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Workspace URL</label>
                <div className="flex items-center gap-0">
                  <span className="bg-white/5 border border-white/10 border-r-0 rounded-l-lg px-3 py-2.5 text-sm text-white/30">blast.app/</span>
                  <input defaultValue="blast-hq" className="flex-1 bg-white/5 border border-white/10 rounded-r-lg px-4 py-2.5 text-sm text-white outline-none focus:border-[#7F77DD] transition-colors" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white mb-3">Members</h3>
              <div className="flex flex-col gap-2">
                {[
                  { name: "Osita Daniel", email: "osita@blast.app", role: "Owner", avatar: "OD" },
                  { name: "Emmanuel", email: "em@blast.app", role: "Admin", avatar: "EM" },
                  { name: "Amaka", email: "amaka@blast.app", role: "Member", avatar: "AM" },
                  { name: "Tunde", email: "tunde@blast.app", role: "Member", avatar: "TK" },
                ].map((member) => (
                  <div key={member.email} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-[#7F77DD] flex items-center justify-center text-xs font-medium text-white">
                      {member.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{member.name}</p>
                      <p className="text-xs text-white/30">{member.email}</p>
                    </div>
                    <span className="text-xs bg-white/10 text-white/50 px-2 py-0.5 rounded-full">{member.role}</span>
                  </div>
                ))}
              </div>
              <button className="mt-3 text-sm text-[#7F77DD] hover:text-white transition-colors">
                + Invite member
              </button>
            </div>
          </div>
        )}

        {/* INTEGRATIONS */}
        {activeTab === "integrations" && (
          <div>
            <h2 className="text-lg font-medium text-white mb-1">Integrations</h2>
            <p className="text-sm text-white/40 mb-6">Connect your tools to Blast AI</p>

            <div className="flex flex-col gap-3">
              {[
                { name: "Gmail", icon: "📧", desc: "Sync emails and extract tasks automatically", connected: false },
                { name: "Google Calendar", icon: "📅", desc: "Sync meetings and deadlines", connected: true },
                { name: "Slack", icon: "💬", desc: "Import messages and mentions", connected: false },
                { name: "Notion", icon: "📝", desc: "Sync pages and databases", connected: false },
                { name: "GitHub", icon: "💻", desc: "Track issues and pull requests", connected: true },
                { name: "Jira", icon: "🎯", desc: "Sync tickets and sprints", connected: false },
                { name: "Trello", icon: "📋", desc: "Import boards and cards", connected: false },
                { name: "Asana", icon: "✓", desc: "Sync tasks and projects", connected: false },
              ].map((integration) => (
                <div key={integration.name} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                    {integration.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{integration.name}</p>
                    <p className="text-xs text-white/40">{integration.desc}</p>
                  </div>
                  <button className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    integration.connected
                      ? "bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400"
                      : "bg-[#7F77DD]/20 text-[#7F77DD] hover:bg-[#7F77DD] hover:text-white"
                  }`}>
                    {integration.connected ? "Connected" : "Connect"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACCOUNT */}
        {activeTab === "account" && (
          <div>
            <h2 className="text-lg font-medium text-white mb-1">Account</h2>
            <p className="text-sm text-white/40 mb-6">Manage your account security and data</p>

            <div className="flex flex-col gap-4 mb-8">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Current password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-[#7F77DD] transition-colors" />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">New password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-[#7F77DD] transition-colors" />
              </div>
              <button onClick={showSaved} className="bg-[#7F77DD] hover:bg-[#6860cc] text-white text-sm px-4 py-2.5 rounded-lg transition-colors w-fit">
                Update password
              </button>
            </div>

            <div className="border-t border-white/5 pt-6">
              <h3 className="text-sm font-medium text-red-400 mb-3">Danger zone</h3>
              <div className="flex flex-col gap-2">
                <button className="text-sm text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-4 py-2.5 rounded-lg transition-colors text-left">
                  Delete my account
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}