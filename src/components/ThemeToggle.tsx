'use client'

// components/ThemeToggle.tsx
// A button that cycles: light → dark → system → light
// Shows the current mode with an icon. Drop it anywhere in the UI.

import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from './ThemeProvider'

const CYCLE = { light: 'dark', dark: 'system', system: 'light' } as const

const ICONS = {
  light:  <Sun  className="h-4 w-4" />,
  dark:   <Moon className="h-4 w-4" />,
  system: <Monitor className="h-4 w-4" />,
}

const LABELS = { light: 'Light', dark: 'Dark', system: 'System' }

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(CYCLE[theme])}
      title={`Theme: ${LABELS[theme]} — click to change`}
      className="
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
        border border-[var(--card-border)]
        bg-[var(--muted-bg)] text-[var(--muted)]
        hover:bg-[var(--sidebar-active-bg)] hover:text-[var(--sidebar-text-active)]
        transition-all duration-200
      "
    >
      {ICONS[theme]}
      <span className="hidden sm:inline">{LABELS[theme]}</span>
    </button>
  )
}