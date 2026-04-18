import { useState, useEffect } from 'react'
import { db } from './firebase'
import { doc, onSnapshot, collection } from 'firebase/firestore'
import { AdminProvider, useAdmin } from './AdminContext'
import IdentityScreen from './components/IdentityScreen'
import SubmitScreen from './components/SubmitScreen'
import VoteScreen from './components/VoteScreen'
import DashboardScreen from './components/DashboardScreen'
import AdminScreen from './components/AdminScreen'
import AdminLoginModal from './components/AdminLoginModal'
import BottomNav from './components/BottomNav'
import WelcomeModal from './components/WelcomeModal'

function getUserId() {
  let id = localStorage.getItem('babyNameUserId')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('babyNameUserId', id)
  }
  return id
}

function Main() {
  const { isAdmin } = useAdmin()
  const [userId] = useState(getUserId)
  const [userData, setUserData] = useState(undefined)
  const [allUsers, setAllUsers] = useState([])
  const [activeTab, setActiveTab] = useState('vote')
  const [showWelcome, setShowWelcome] = useState(
    () => !localStorage.getItem('babyNameWelcomeSeen')
  )
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false)

  useEffect(() => {
    const unsubUser = onSnapshot(doc(db, 'users', userId), (snap) => {
      setUserData(snap.exists() ? { id: snap.id, ...snap.data() } : null)
    })
    const unsubAll = onSnapshot(collection(db, 'users'), (snap) => {
      const users = []
      snap.forEach((d) => users.push({ id: d.id, ...d.data() }))
      setAllUsers(users)
    })
    return () => { unsubUser(); unsubAll() }
  }, [userId])

  const dismissWelcome = () => {
    localStorage.setItem('babyNameWelcomeSeen', '1')
    setShowWelcome(false)
  }

  if (showWelcome) return <WelcomeModal onDismiss={dismissWelcome} />

  if (userData === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center animate-pulse">
            <span className="text-2xl">👶</span>
          </div>
          <p className="text-gray-400 text-sm font-medium">Loading…</p>
        </div>
      </div>
    )
  }

  if (!userData?.name) return <IdentityScreen userId={userId} />
  if (!userData?.hasSubmitted) return <SubmitScreen userId={userId} userName={userData.name} onSubmitted={() => setShowSubmitSuccess(true)} />

  return (
    <div className="min-h-screen bg-gray-50">
      {showSubmitSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden text-center">
            <div className="bg-gradient-to-br from-violet-600 to-pink-500 px-6 pt-6 pb-5">
              <img src="/Baby-Name/Success Baby.gif" alt="" className="w-36 h-36 object-contain mx-auto rounded-2xl" />
            </div>
            <div className="px-6 py-6">
              <h2 className="text-gray-900 text-xl font-bold mb-1">Names submitted!</h2>
              <p className="text-gray-500 text-sm">
                Your names are locked in. Now head over to the Vote tab to pick your favourites!
              </p>
            </div>
          </div>
        </div>
      )}
      {showAdminLogin && <AdminLoginModal onClose={() => setShowAdminLogin(false)} />}

      {activeTab === 'vote' && (
        <VoteScreen userId={userId} userData={userData} allUsers={allUsers} />
      )}
      {activeTab === 'dashboard' && (
        <DashboardScreen allUsers={allUsers} />
      )}
      {activeTab === 'admin' && isAdmin && (
        <AdminScreen allUsers={allUsers} />
      )}

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasVoted={userData?.hasVoted}
        onAdminTap={() => setShowAdminLogin(true)}
      />
    </div>
  )
}

export default function App() {
  return (
    <AdminProvider>
      <Main />
    </AdminProvider>
  )
}
