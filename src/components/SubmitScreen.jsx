import { useState, useEffect } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

const MAX_NAMES = 3

function toEntry(raw) {
  if (!raw) return { name: '', meaning: '' }
  if (typeof raw === 'string') return { name: raw, meaning: '' }
  return raw
}

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  )
}

function LockedNameEntry({ displayIndex, entry, gender }) {
  const badge = gender === 'boy' ? 'bg-sky-100 text-sky-600' : 'bg-pink-100 text-pink-600'
  return (
    <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5 opacity-60">
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold ${badge} px-2 py-0.5 rounded-full`}>
          Name {displayIndex}
        </span>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <LockIcon /> Locked
        </span>
      </div>
      <div className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-gray-700 text-base bg-white">
        {entry.name}
      </div>
      {entry.meaning ? (
        <div className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-500 text-sm bg-white">
          {entry.meaning}
        </div>
      ) : null}
    </div>
  )
}

function NameEntry({ displayIndex, entry, onChange, localIndex, gender }) {
  const colors = {
    boy: { ring: 'focus:ring-sky-500', badge: 'bg-sky-100 text-sky-600' },
    girl: { ring: 'focus:ring-pink-500', badge: 'bg-pink-100 text-pink-600' },
  }
  const c = colors[gender]

  return (
    <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5">
      <span className={`text-xs font-semibold ${c.badge} px-2 py-0.5 rounded-full`}>
        Name {displayIndex}
      </span>
      <input
        type="text"
        value={entry.name}
        onChange={(e) => onChange(localIndex, 'name', e.target.value)}
        placeholder="e.g. Noah"
        className={`w-full border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base placeholder-gray-300 bg-white focus:outline-none focus:ring-2 ${c.ring} focus:border-transparent transition`}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="words"
      />
      <input
        type="text"
        value={entry.meaning}
        onChange={(e) => onChange(localIndex, 'meaning', e.target.value)}
        placeholder="Meaning or origin (optional)"
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition"
        autoComplete="off"
        autoCorrect="off"
      />
    </div>
  )
}

const emptyEntry = () => ({ name: '', meaning: '' })

export default function SubmitScreen({
  userId,
  userName,
  onSubmitted,
  existingBoyNames = [],
  existingGirlNames = [],
  isAddMode = false,
}) {
  const existingBoy = existingBoyNames.map(toEntry)
  const existingGirl = existingGirlNames.map(toEntry)

  const newBoySlots = MAX_NAMES - existingBoy.length
  const newGirlSlots = MAX_NAMES - existingGirl.length

  const [boyNames, setBoyNames] = useState(() => Array.from({ length: isAddMode ? newBoySlots : MAX_NAMES }, emptyEntry))
  const [girlNames, setGirlNames] = useState(() => Array.from({ length: isAddMode ? newGirlSlots : MAX_NAMES }, emptyEntry))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Reset new slots when Firestore reflects the saved names
  useEffect(() => {
    if (!isAddMode) return
    setBoyNames(Array.from({ length: MAX_NAMES - existingBoy.length }, emptyEntry))
  }, [existingBoy.length]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isAddMode) return
    setGirlNames(Array.from({ length: MAX_NAMES - existingGirl.length }, emptyEntry))
  }, [existingGirl.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateBoy = (i, field, val) =>
    setBoyNames((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: val } : e)))
  const updateGirl = (i, field, val) =>
    setGirlNames((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: val } : e)))

  const validNewBoy = boyNames.filter((e) => e.name.trim()).length
  const validNewGirl = girlNames.filter((e) => e.name.trim()).length
  const totalBoy = existingBoy.length + validNewBoy
  const totalGirl = existingGirl.length + validNewGirl

  const isBoyFull = existingBoy.length >= MAX_NAMES
  const isGirlFull = existingGirl.length >= MAX_NAMES
  const isAllFull = isBoyFull && isGirlFull

  const canSubmit = isAddMode
    ? validNewBoy + validNewGirl >= 1
    : validNewBoy >= 1 && validNewGirl >= 1

  const handleSubmit = async () => {
    if (!canSubmit || saving) return
    setSaving(true)
    const allBoy = [
      ...existingBoy,
      ...boyNames.filter((e) => e.name.trim()).map((e) => ({ name: e.name.trim(), meaning: e.meaning.trim() })),
    ]
    const allGirl = [
      ...existingGirl,
      ...girlNames.filter((e) => e.name.trim()).map((e) => ({ name: e.name.trim(), meaning: e.meaning.trim() })),
    ]
    if (!isAddMode) onSubmitted()
    await updateDoc(doc(db, 'users', userId), {
      boyNames: allBoy,
      girlNames: allGirl,
      hasSubmitted: true,
    })
    setSaving(false)
    if (isAddMode) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const headerTitle = isAddMode ? 'Add More Names' : 'Submit Your Names'
  const headerSub = isAddMode
    ? 'Existing names are locked. Add more up to the 3-name limit.'
    : 'Share up to 3 names each — meaning is optional'
  const buttonLabel = saving ? (isAddMode ? 'Saving…' : 'Submitting…') : isAddMode ? 'Add Names' : 'Submit Names'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-violet-600 safe-top">
        <div className="px-6 pt-2 pb-5">
          <p className="text-violet-200 text-sm font-medium">Hi, {userName}!</p>
          <h1 className="text-white text-2xl font-bold mt-0.5">{headerTitle}</h1>
          <p className="text-violet-200 text-sm mt-1">{headerSub}</p>
        </div>
      </div>

      {saved && (
        <div className="mx-4 mt-4 bg-green-50 border border-green-200 rounded-2xl px-5 py-3 flex items-center gap-2">
          <span className="text-green-600 text-sm font-medium">Names added successfully!</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-nav px-4 pt-4 space-y-4">
        {/* Boy Names */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-sky-50 px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-sky-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">👦</span>
            </div>
            <div>
              <p className="text-sky-700 font-semibold text-sm">Boy Names</p>
              <p className="text-sky-500 text-xs">
                {isAddMode ? `${totalBoy}/3 total` : `${validNewBoy}/3 entered`}
              </p>
            </div>
          </div>
          <div className="px-4 py-4 space-y-3">
            {isAddMode && existingBoy.map((entry, i) => (
              <LockedNameEntry key={i} displayIndex={i + 1} entry={entry} gender="boy" />
            ))}
            {isBoyFull ? (
              <p className="text-gray-400 text-sm text-center py-2">All 3 boy name slots used</p>
            ) : (
              boyNames.map((entry, i) => (
                <NameEntry
                  key={i}
                  localIndex={i}
                  displayIndex={existingBoy.length + i + 1}
                  entry={entry}
                  onChange={updateBoy}
                  gender="boy"
                />
              ))
            )}
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
              <p className="text-pink-500 text-xs">
                {isAddMode ? `${totalGirl}/3 total` : `${validNewGirl}/3 entered`}
              </p>
            </div>
          </div>
          <div className="px-4 py-4 space-y-3">
            {isAddMode && existingGirl.map((entry, i) => (
              <LockedNameEntry key={i} displayIndex={i + 1} entry={entry} gender="girl" />
            ))}
            {isGirlFull ? (
              <p className="text-gray-400 text-sm text-center py-2">All 3 girl name slots used</p>
            ) : (
              girlNames.map((entry, i) => (
                <NameEntry
                  key={i}
                  localIndex={i}
                  displayIndex={existingGirl.length + i + 1}
                  entry={entry}
                  onChange={updateGirl}
                  gender="girl"
                />
              ))
            )}
          </div>
        </div>

        {isAllFull ? (
          <div className="bg-white rounded-2xl shadow-sm px-5 py-4 text-center">
            <p className="text-gray-500 text-sm">You've used all 3 name slots for each gender.</p>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || saving}
            className="w-full bg-violet-600 text-white font-semibold rounded-2xl py-4 text-base transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {buttonLabel}
          </button>
        )}

        <div className="safe-bottom" />
      </div>
    </div>
  )
}
