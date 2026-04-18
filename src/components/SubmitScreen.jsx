import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

function NameEntry({ index, entry, onChange, gender }) {
  const colors = {
    boy: {
      ring: 'focus:ring-sky-500',
      label: 'text-sky-600',
      badge: 'bg-sky-100 text-sky-600',
    },
    girl: {
      ring: 'focus:ring-pink-500',
      label: 'text-pink-600',
      badge: 'bg-pink-100 text-pink-600',
    },
  }
  const c = colors[gender]

  return (
    <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5">
      <span className={`text-xs font-semibold ${c.badge} px-2 py-0.5 rounded-full`}>
        Name {index + 1}
      </span>
      <input
        type="text"
        value={entry.name}
        onChange={(e) => onChange(index, 'name', e.target.value)}
        placeholder="e.g. Noah"
        className={`w-full border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base placeholder-gray-300 bg-white focus:outline-none focus:ring-2 ${c.ring} focus:border-transparent transition`}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="words"
      />
      <input
        type="text"
        value={entry.meaning}
        onChange={(e) => onChange(index, 'meaning', e.target.value)}
        placeholder="Meaning or origin (optional)"
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition"
        autoComplete="off"
        autoCorrect="off"
      />
    </div>
  )
}

const emptyEntry = () => ({ name: '', meaning: '' })

export default function SubmitScreen({ userId, userName }) {
  const [boyNames, setBoyNames] = useState([emptyEntry(), emptyEntry(), emptyEntry()])
  const [girlNames, setGirlNames] = useState([emptyEntry(), emptyEntry(), emptyEntry()])
  const [saving, setSaving] = useState(false)

  const updateBoy = (i, field, val) =>
    setBoyNames((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e))
  const updateGirl = (i, field, val) =>
    setGirlNames((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e))

  const validBoy = boyNames.filter((e) => e.name.trim()).length
  const validGirl = girlNames.filter((e) => e.name.trim()).length
  const canSubmit = validBoy >= 1 && validGirl >= 1

  const handleSubmit = async () => {
    if (!canSubmit || saving) return
    setSaving(true)
    await updateDoc(doc(db, 'users', userId), {
      boyNames: boyNames.filter((e) => e.name.trim()).map((e) => ({
        name: e.name.trim(),
        meaning: e.meaning.trim(),
      })),
      girlNames: girlNames.filter((e) => e.name.trim()).map((e) => ({
        name: e.name.trim(),
        meaning: e.meaning.trim(),
      })),
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
          <p className="text-violet-200 text-sm mt-1">Share up to 3 names each — meaning is optional</p>
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
          <div className="px-4 py-4 space-y-3">
            {boyNames.map((entry, i) => (
              <NameEntry key={i} index={i} entry={entry} onChange={updateBoy} gender="boy" />
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
          <div className="px-4 py-4 space-y-3">
            {girlNames.map((entry, i) => (
              <NameEntry key={i} index={i} entry={entry} onChange={updateGirl} gender="girl" />
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
