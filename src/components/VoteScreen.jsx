import { useState, useEffect } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

function NameCard({ name, submitters, selected, onSelect, color }) {
  const colors = {
    boy: {
      ring: selected ? 'ring-2 ring-sky-500 bg-sky-50' : 'ring-1 ring-gray-100 bg-white',
      dot: selected ? 'bg-sky-500' : 'bg-gray-200',
      text: 'text-sky-600',
    },
    girl: {
      ring: selected ? 'ring-2 ring-pink-500 bg-pink-50' : 'ring-1 ring-gray-100 bg-white',
      dot: selected ? 'bg-pink-500' : 'bg-gray-200',
      text: 'text-pink-600',
    },
  }
  const c = colors[color]

  return (
    <button
      onClick={() => onSelect(name)}
      className={`w-full rounded-2xl px-4 py-4 flex items-center gap-3 transition active:scale-95 ${c.ring}`}
    >
      <div className={`w-5 h-5 rounded-full flex-shrink-0 transition ${c.dot} flex items-center justify-center`}>
        {selected && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>
      <div className="flex-1 text-left">
        <p className="text-gray-900 font-semibold text-base">{name}</p>
        <p className="text-gray-400 text-xs mt-0.5">by {submitters.join(', ')}</p>
      </div>
    </button>
  )
}

export default function VoteScreen({ userId, userData, allUsers }) {
  const otherUsers = allUsers.filter((u) => u.id !== userId && u.hasSubmitted)

  const boyMap = {}
  const girlMap = {}
  otherUsers.forEach((user) => {
    user.boyNames?.forEach((name) => {
      if (!name?.trim()) return
      const key = name.trim().toLowerCase()
      if (!boyMap[key]) boyMap[key] = { name: name.trim(), submitters: [] }
      if (!boyMap[key].submitters.includes(user.name)) boyMap[key].submitters.push(user.name)
    })
    user.girlNames?.forEach((name) => {
      if (!name?.trim()) return
      const key = name.trim().toLowerCase()
      if (!girlMap[key]) girlMap[key] = { name: name.trim(), submitters: [] }
      if (!girlMap[key].submitters.includes(user.name)) girlMap[key].submitters.push(user.name)
    })
  })

  const boyOptions = Object.values(boyMap).sort((a, b) => a.name.localeCompare(b.name))
  const girlOptions = Object.values(girlMap).sort((a, b) => a.name.localeCompare(b.name))

  const [boyVote, setBoyVote] = useState(userData.boyVote || '')
  const [girlVote, setGirlVote] = useState(userData.girlVote || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setBoyVote(userData.boyVote || '')
    setGirlVote(userData.girlVote || '')
  }, [userData.boyVote, userData.girlVote])

  const canVote = boyVote && girlVote
  const hasChanged = boyVote !== (userData.boyVote || '') || girlVote !== (userData.girlVote || '')

  const handleVote = async () => {
    if (!canVote || saving) return
    setSaving(true)
    await updateDoc(doc(db, 'users', userId), {
      boyVote,
      girlVote,
      hasVoted: true,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const totalVoters = allUsers.filter((u) => u.hasVoted).length

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-violet-600 safe-top">
        <div className="px-6 pt-2 pb-5">
          <div className="flex items-center justify-between">
            <h1 className="text-white text-2xl font-bold">Cast Your Vote</h1>
            {totalVoters > 0 && (
              <span className="bg-white/20 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                {totalVoters} voted
              </span>
            )}
          </div>
          <p className="text-violet-200 text-sm mt-1">Pick one boy name and one girl name</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-nav px-4 pt-4 space-y-4">
        {saved && (
          <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-3 flex items-center gap-2">
            <span className="text-green-500 text-lg">✓</span>
            <p className="text-green-700 text-sm font-medium">Your vote has been saved!</p>
          </div>
        )}

        {/* Boy Names */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-sky-50 px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-sky-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">👦</span>
            </div>
            <div>
              <p className="text-sky-700 font-semibold text-sm">Boy Names</p>
              <p className="text-sky-500 text-xs">
                {boyVote ? `Voted: ${boyVote}` : 'Tap to select'}
              </p>
            </div>
          </div>
          <div className="px-4 py-3 space-y-2">
            {boyOptions.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                No boy names submitted by others yet
              </p>
            ) : (
              boyOptions.map(({ name, submitters }) => (
                <NameCard
                  key={name}
                  name={name}
                  submitters={submitters}
                  selected={boyVote.toLowerCase() === name.toLowerCase()}
                  onSelect={setBoyVote}
                  color="boy"
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
                {girlVote ? `Voted: ${girlVote}` : 'Tap to select'}
              </p>
            </div>
          </div>
          <div className="px-4 py-3 space-y-2">
            {girlOptions.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                No girl names submitted by others yet
              </p>
            ) : (
              girlOptions.map(({ name, submitters }) => (
                <NameCard
                  key={name}
                  name={name}
                  submitters={submitters}
                  selected={girlVote.toLowerCase() === name.toLowerCase()}
                  onSelect={setGirlVote}
                  color="girl"
                />
              ))
            )}
          </div>
        </div>

        {canVote && (hasChanged || !userData.hasVoted) && (
          <button
            onClick={handleVote}
            disabled={saving}
            className="w-full bg-violet-600 text-white font-semibold rounded-2xl py-4 text-base transition active:scale-95 disabled:opacity-60 shadow-sm"
          >
            {saving ? 'Saving…' : userData.hasVoted ? 'Update Vote' : 'Submit Vote'}
          </button>
        )}

        {userData.hasVoted && !hasChanged && (
          <div className="bg-violet-50 rounded-2xl px-4 py-4 text-center">
            <p className="text-violet-700 font-medium text-sm">Vote submitted!</p>
            <p className="text-violet-500 text-xs mt-0.5">Tap any name above to change your vote</p>
          </div>
        )}

        <div className="safe-bottom" />
      </div>
    </div>
  )
}
