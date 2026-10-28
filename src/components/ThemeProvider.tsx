'use client'

// components/ThemeProvider.tsx
// Manages dark/light/system theme.
// Adds/removes the 'dark' class on <html> based on preference.
// Reads from localStorage so choice persists across sessions.

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
  resolvedTheme: 'light' | 'dark' // what is actually showing right now
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  setTheme: () => {},
  resolvedTheme: 'light',
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  // On mount: read saved preference
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    setThemeState(saved ?? 'system')
  }, [])

  // Apply class to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    const isDark =
      theme === 'dark' || (theme === 'system' && prefersDark)

    root.classList.toggle('dark', isDark)
    setResolvedTheme(isDark ? 'dark' : 'light')
  }, [theme])

  // Listen for system preference changes when theme is 'system'
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches)
      setResolvedTheme(e.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const setTheme = (t: Theme) => {
    setThemeState(t)
    localStorage.setItem('theme', t)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)