import { useAdmin } from '../AdminContext'

function VoteIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  )
}

function DashboardIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}

function AdminIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  )
}

export default function BottomNav({ activeTab, setActiveTab, hasVoted, onAdminTap }) {
  const { isAdmin } = useAdmin()

  const baseTabs = [
    { id: 'vote', label: 'Vote', Icon: VoteIcon },
    { id: 'dashboard', label: 'Results', Icon: DashboardIcon },
  ]

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex">
        {baseTabs.map(({ id, label, Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition ${
                active ? 'text-violet-600' : 'text-gray-400'
              }`}
            >
              <div className="relative">
                <Icon active={active} />
                {id === 'vote' && !hasVoted && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full" />
                )}
              </div>
              <span className={`text-xs font-medium ${active ? 'text-violet-600' : 'text-gray-400'}`}>
                {label}
              </span>
            </button>
          )
        })}

        {/* Admin tab — always visible but lock icon; shows panel if logged in */}
        <button
          onClick={() => {
            if (isAdmin) {
              setActiveTab('admin')
            } else {
              onAdminTap()
            }
          }}
          className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition ${
            activeTab === 'admin' && isAdmin ? 'text-violet-600' : 'text-gray-300'
          }`}
        >
          <AdminIcon active={activeTab === 'admin' && isAdmin} />
          <span className={`text-xs font-medium ${activeTab === 'admin' && isAdmin ? 'text-violet-600' : 'text-gray-300'}`}>
            Admin
          </span>
        </button>
      </div>
    </div>
  )
}
