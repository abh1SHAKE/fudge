import React, { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User, AuthResponse } from '../types'
import { authService } from '../services/auth'
import toast from 'react-hot-toast'
import { AuthContext } from './AuthContext'

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = authService.getCurrentUser()
    if (savedUser) setUser(savedUser)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    const authData: AuthResponse = await authService.login(email, password)
    authService.setAuthData(authData)
    setUser(authData.user)
    toast.success('Login successful!')
  }

  const register = async (username: string, email: string, password: string): Promise<void> => {
    const authData: AuthResponse = await authService.register(username, email, password)
    authService.setAuthData(authData)
    setUser(authData.user)
    toast.success('Registration successful!')
  }

  const logout = (): void => {
    authService.logout()
    setUser(null)
    toast.success('Logged out successfully')
  }

  const value = { user, isAuthenticated: !!user, isLoading, login, register, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
