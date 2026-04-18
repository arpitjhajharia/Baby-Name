import { useState, useEffect } from 'react'
import { db } from './firebase'
import { doc, onSnapshot, collection } from 'firebase/firestore'
import IdentityScreen from './components/IdentityScreen'
import SubmitScreen from './components/SubmitScreen'
import VoteScreen from './components/VoteScreen'
import DashboardScreen from './components/DashboardScreen'
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

export default function App() {
  const [userId] = useState(getUserId)
  const [userData, setUserData] = useState(undefined)
  const [allUsers, setAllUsers] = useState([])
  const [activeTab, setActiveTab] = useState('vote')
  const [showWelcome, setShowWelcome] = useState(
    () => !localStorage.getItem('babyNameWelcomeSeen')
  )

  const dismissWelcome = () => {
    localStorage.setItem('babyNameWelcomeSeen', '1')
    setShowWelcome(false)
  }

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

  if (showWelcome) {
    return <WelcomeModal onDismiss={dismissWelcome} />
  }

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

  if (!userData?.name) {
    return <IdentityScreen userId={userId} />
  }

  if (!userData?.hasSubmitted) {
    return <SubmitScreen userId={userId} userName={userData.name} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {activeTab === 'vote' && (
        <VoteScreen userId={userId} userData={userData} allUsers={allUsers} />
      )}
      {activeTab === 'dashboard' && (
        <DashboardScreen allUsers={allUsers} />
      )}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} hasVoted={userData?.hasVoted} />
    </div>
  )
}
