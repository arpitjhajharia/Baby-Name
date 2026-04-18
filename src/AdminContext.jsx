import { createContext, useContext, useState } from 'react'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(
    () => sessionStorage.getItem('babyNameAdmin') === '1'
  )

  const login = (password) => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      sessionStorage.setItem('babyNameAdmin', '1')
      setIsAdmin(true)
      return true
    }
    return false
  }

  const logout = () => {
    sessionStorage.removeItem('babyNameAdmin')
    setIsAdmin(false)
  }

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
