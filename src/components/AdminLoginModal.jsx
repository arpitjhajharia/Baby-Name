import { useState } from 'react'
import { useAdmin } from '../AdminContext'

export default function AdminLoginModal({ onClose }) {
  const { login } = useAdmin()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleLogin = () => {
    if (login(password)) {
      onClose()
    } else {
      setError(true)
      setPassword('')
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-6 sm:pb-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-gray-900 font-bold text-lg">Admin Login</h2>
            <p className="text-gray-400 text-xs mt-0.5">Enter admin password to continue</p>
          </div>
          <button onClick={onClose} className="text-gray-400 text-2xl leading-none active:scale-90 transition">×</button>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="Password"
          autoFocus
          className={`w-full border rounded-2xl px-4 py-4 text-base focus:outline-none focus:ring-2 transition ${
            error
              ? 'border-red-300 focus:ring-red-400 bg-red-50'
              : 'border-gray-200 focus:ring-violet-500'
          }`}
        />
        {error && <p className="text-red-500 text-xs mt-2">Incorrect password</p>}

        <button
          onClick={handleLogin}
          className="mt-4 w-full bg-violet-600 text-white font-semibold rounded-2xl py-4 text-base transition active:scale-95"
        >
          Login
        </button>
      </div>
    </div>
  )
}
