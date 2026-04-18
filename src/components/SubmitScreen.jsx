import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

function NameInput({ index, value, onChange, gender }) {
  const color = gender === 'boy' ? 'focus:ring-sky-500' : 'focus:ring-pink-500'
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(index, e.target.value)}
      placeholder={`Name ${index + 1}`}
      className={`w-full border border-gray-200 rounded-2xl px-4 py-4 text-gray-900 text-base placeholder-gray-300 focus:outline-none focus:ring-2 ${color} focus:border-transparent transition bg-white`}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="words"
    />
  )
}

export default function SubmitScreen({ userId, userName }) {
  const [boyNames, setBoyNames] = useState(['', '', ''])
  const [girlNames, setGirlNames] = useState(['', '', ''])
  const [saving, setSaving] = useState(false)

  const updateBoy = (i, val) => setBoyNames((prev) => prev.map((n, idx) => idx === i ? val : n))
  const updateGirl = (i, val) => setGirlNames((prev) => prev.map((n, idx) => idx === i ? val : n))

  const validBoy = boyNames.filter((n) => n.trim()).length
  const validGirl = girlNames.filter((n) => n.trim()).length
  const canSubmit = validBoy >= 1 && validGirl >= 1

  const handleSubmit = async () => {
    if (!canSubmit || saving) return
    setSaving(true)
    await updateDoc(doc(db, 'users', userId), {
      boyNames: boyNames.map((n) => n.trim()).filter(Boolean),
      girlNames: girlNames.map((n) => n.trim()).filter(Boolean),
      hasSubmitted: true,
    })
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-violet-600 safe-top">
        <div className="px-6 pt-2 pb-5">
          <p className="text-violet-200 text-sm font-medium">Hi, {userName}!</p>
          <h1 className="text-white text-2xl font-bold mt-0.5">Submit Your Names</h1>
          <p className="text-violet-200 text-sm mt-1">Share up to 3 names for each — at least 1 each required</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-nav px-4 pt-4 space-y-4">
        {/* Boy Names */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-sky-50 px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-sky-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">👦</span>
            </div>
            <div>
              <p className="text-sky-700 font-semibold text-sm">Boy Names</p>
              <p className="text-sky-500 text-xs">{validBoy}/3 entered</p>
            </div>
          </div>
          <div className="px-5 py-4 space-y-3">
            {boyNames.map((n, i) => (
              <NameInput key={i} index={i} value={n} onChange={updateBoy} gender="boy" />
            ))}
          </div>
        </div>

        {/* Girl Names */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-pink-50 px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-pink-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">👧</span>
            </div>
            <div>
              <p className="text-pink-700 font-semibold text-sm">Girl Names</p>
              <p className="text-pink-500 text-xs">{validGirl}/3 entered</p>
            </div>
          </div>
          <div className="px-5 py-4 space-y-3">
            {girlNames.map((n, i) => (
              <NameInput key={i} index={i} value={n} onChange={updateGirl} gender="girl" />
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit || saving}
          className="w-full bg-violet-600 text-white font-semibold rounded-2xl py-4 text-base transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          {saving ? 'Submitting…' : 'Submit Names'}
        </button>

        <div className="safe-bottom" />
      </div>
    </div>
  )
}
