import { useState } from 'react'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAdmin } from '../AdminContext'

function toEntry(raw) {
  if (!raw) return null
  if (typeof raw === 'string') return { name: raw, meaning: '' }
  return raw
}

function ConfirmModal({ name, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-6">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6">
        <h2 className="text-gray-900 font-bold text-lg mb-1">Delete entry?</h2>
        <p className="text-gray-500 text-sm mb-6">
          This will permanently remove <span className="font-semibold text-gray-800">{name}</span>'s submission and votes.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-gray-200 text-gray-700 font-semibold rounded-2xl py-3.5 transition active:scale-95">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 bg-red-500 text-white font-semibold rounded-2xl py-3.5 transition active:scale-95">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminScreen({ allUsers }) {
  const { logout } = useAdmin()
  const [confirm, setConfirm] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const submitted = allUsers.filter((u) => u.hasSubmitted)

  const handleDelete = async (user) => {
    setDeleting(user.id)
    setConfirm(null)
    await deleteDoc(doc(db, 'users', user.id))
    setDeleting(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {confirm && (
        <ConfirmModal
          name={confirm.name}
          onConfirm={() => handleDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="bg-violet-600 safe-top">
        <div className="px-6 pt-2 pb-5 flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
            <p className="text-violet-200 text-sm mt-0.5">{submitted.length} submission{submitted.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={logout}
            className="bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full active:scale-95 transition"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-nav px-4 pt-4 space-y-3">
        {submitted.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-10">No submissions yet</p>
        )}

        {submitted.map((user) => {
          const boyNames = (user.boyNames || []).map(toEntry).filter(Boolean)
          const girlNames = (user.girlNames || []).map(toEntry).filter(Boolean)

          return (
            <div key={user.id} className="bg-white rounded-3xl shadow-sm overflow-hidden">
              {/* Header row */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <div>
                  <p className="text-gray-900 font-semibold text-base">{user.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {user.hasVoted ? (
                      <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Voted</span>
                    ) : (
                      <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full">Not voted</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setConfirm(user)}
                  disabled={deleting === user.id}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-400 active:scale-90 transition disabled:opacity-40"
                >
                  {deleting === user.id ? (
                    <span className="text-xs">…</span>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Names */}
              <div className="px-5 py-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sky-600 text-xs font-semibold mb-2">👦 Boy Names</p>
                  {boyNames.length === 0 ? (
                    <p className="text-gray-300 text-xs">—</p>
                  ) : (
                    boyNames.map((e, i) => (
                      <div key={i} className="mb-1.5">
                        <p className="text-gray-800 text-sm font-medium">{e.name}</p>
                        {e.meaning ? <p className="text-gray-400 text-xs italic">{e.meaning}</p> : null}
                      </div>
                    ))
                  )}
                </div>
                <div>
                  <p className="text-pink-600 text-xs font-semibold mb-2">👧 Girl Names</p>
                  {girlNames.length === 0 ? (
                    <p className="text-gray-300 text-xs">—</p>
                  ) : (
                    girlNames.map((e, i) => (
                      <div key={i} className="mb-1.5">
                        <p className="text-gray-800 text-sm font-medium">{e.name}</p>
                        {e.meaning ? <p className="text-gray-400 text-xs italic">{e.meaning}</p> : null}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {user.hasVoted && (
                <div className="px-5 pb-4 flex gap-4">
                  <p className="text-xs text-gray-400">
                    Voted boy: <span className="text-gray-700 font-medium">{user.boyVote || '—'}</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Voted girl: <span className="text-gray-700 font-medium">{user.girlVote || '—'}</span>
                  </p>
                </div>
              )}
            </div>
          )
        })}

        <div className="safe-bottom" />
      </div>
    </div>
  )
}
