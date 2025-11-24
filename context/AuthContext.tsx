// context/AuthContext.tsx
"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface User {
    id?: string
    username: string
    email: string
    phoneNumber: string
    gender: boolean
    position: boolean
    birthdate: string
}

interface AuthContextType {
    user: User | null
    login: (userData: User) => void
    logout: () => void
    isOperator: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    const login = (userData: User) => {
        setUser(userData)
    }

    const logout = () => {
        setUser(null)
        window.location.href = "/auth"
    }

    const value: AuthContextType = {
        user,
        login,
        logout,
        isOperator: user?.position === true,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}