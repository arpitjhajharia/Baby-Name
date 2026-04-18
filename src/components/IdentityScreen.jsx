import { useState } from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export default function IdentityScreen({ userId }) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  const handleContinue = async () => {
    const trimmed = name.trim()
    if (!trimmed || saving) return
    setSaving(true)
    await setDoc(doc(db, 'users', userId), {
      name: trimmed,
      hasSubmitted: false,
      hasVoted: false,
      boyNames: [],
      girlNames: [],
      boyVote: null,
      girlVote: null,
      createdAt: serverTimestamp(),
    })
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-600 to-violet-700 flex flex-col">
      <div className="safe-top" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6">
          <span className="text-5xl">👶</span>
        </div>
        <h1 className="text-white text-3xl font-bold text-center mb-2">Baby Name Vote</h1>
        <p className="text-violet-200 text-center text-sm mb-12">
          Help choose the perfect name for our little one
        </p>

        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6">
          <h2 className="text-gray-900 font-semibold text-lg mb-1">Welcome!</h2>
          <p className="text-gray-500 text-sm mb-5">Enter your name so the family knows it's you</p>

          <label className="block text-gray-700 text-sm font-medium mb-2">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
            placeholder="e.g. Aunt Sarah"
            className="w-full border border-gray-200 rounded-2xl px-4 py-4 text-gray-900 text-base placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
            autoFocus
            autoComplete="name"
          />

          <button
            onClick={handleContinue}
            disabled={!name.trim() || saving}
            className="mt-4 w-full bg-violet-600 text-white font-semibold rounded-2xl py-4 text-base transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? 'Joining…' : 'Get Started'}
          </button>
        </div>
      </div>

      <div className="safe-bottom" />
    </div>
  )
}
