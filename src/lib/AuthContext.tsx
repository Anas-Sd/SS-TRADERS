import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Session, User } from '@supabase/supabase-js'

type AuthContextType = {
    session: Session | null
    user: User | null
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session)
                setUser(session?.user ?? null)
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>

        const resetTimer = () => {
            clearTimeout(timeout)
            if (session) {
                timeout = setTimeout(async () => {
                    await supabase.auth.signOut()
                    localStorage.setItem('sessionExpired', 'true')
                    window.dispatchEvent(new Event('sessionExpired'))
                }, 30 * 60 * 1000) // 30 minutes
            }
        }

        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart']

        if (session) {
            events.forEach(e => window.addEventListener(e, resetTimer))
            resetTimer()
        }

        return () => {
            clearTimeout(timeout)
            events.forEach(e => window.removeEventListener(e, resetTimer))
        }
    }, [session])

    return (
        <AuthContext.Provider value={{ session, user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}
