'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Session } from 'next-auth'
import {
  Home, Settings, BarChart3, Users, Printer, Phone, Truck,
  TrendingUp, FileText, AlertCircle, Clock, Menu, X, LogOut,
  ShoppingBag, Inbox,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'

interface DashboardLayoutProps {
  children: React.ReactNode
  currentDate?: string
}

interface NavigationItem {
  name: string
  href: string
  icon: React.ElementType
  permissionKey?: string
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard',     href: '/dashboard',                icon: Home },
  { name: 'Admin',         href: '/dashboard/admin',          icon: Settings,    permissionKey: 'admin' },
  { name: 'MIS Reports',   href: '/dashboard/mis',            icon: BarChart3,   permissionKey: 'mis' },
  { name: 'Chalan/Bills',  href: '/dashboard/chalan',         icon: FileText,    permissionKey: 'billing' },
  { name: 'Clients',       href: '/dashboard/clients',        icon: Users,       permissionKey: 'clients' },
  { name: 'Printers',      href: '/dashboard/printers',       icon: Printer,     permissionKey: 'printers' },
  { name: 'Complaints',    href: '/dashboard/complaints',     icon: Phone,       permissionKey: 'complaints' },
  { name: 'Dispatch',      href: '/dashboard/dispatch',       icon: Truck,       permissionKey: 'dispatch' },
  { name: 'Marketing',     href: '/dashboard/marketing',      icon: TrendingUp,  permissionKey: 'marketing' },
  { name: 'New Order',     href: '/dashboard/orders/new',     icon: FileText,    permissionKey: 'orders' },
  { name: 'New Complaint', href: '/dashboard/complaints/new', icon: AlertCircle, permissionKey: 'complaints' },
  { name: 'Pending Work',  href: '/dashboard/pending-work',   icon: Clock,       permissionKey: 'pendingWork' },
  { name: 'Client Orders', href: '/dashboard/client-orders',  icon: ShoppingBag, permissionKey: 'orders' },
  { name: 'Enquiries',     href: '/dashboard/enquiries',      icon: Inbox,       permissionKey: 'clients' },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()

  const userPermissions = session?.user?.permissions || {}
  const filteredNavigation = navigation.filter(item => {
    if (!item.permissionKey) return true
    return !!(userPermissions as Record<string, boolean>)[item.permissionKey]
  })

  const handleLogout = async () => await signOut({ callbackUrl: '/login' })

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">

      {/* ── Mobile sidebar overlay ── */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[var(--sidebar-bg)] shadow-2xl">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full text-white hover:bg-white/10 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <SidebarContent
            navigation={filteredNavigation}
            pathname={pathname}
            onLogout={handleLogout}
            session={session}
          />
        </div>
      </div>

      {/* ── Desktop sidebar ── */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        <SidebarContent
          navigation={filteredNavigation}
          pathname={pathname}
          onLogout={handleLogout}
          session={session}
        />
      </div>

      {/* ── Main content area ── */}
      <div className="md:pl-64 flex flex-col flex-1 min-h-screen">

        {/* Mobile hamburger */}
        <div className="sticky top-0 z-20 md:hidden px-4 py-2 bg-[var(--topbar-bg)] border-b border-[var(--topbar-border)]">
          <button
            className="h-10 w-10 flex items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--muted-bg)] transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* ── Top bar ── */}
        <div className="sticky top-0 z-10 bg-[var(--topbar-bg)] border-b border-[var(--topbar-border)] shadow-sm hidden md:block">
          <div className="px-6 lg:px-8">
            <div className="py-4 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-[var(--foreground)]">
                  Welcome back, {session?.user?.username || session?.user?.name || 'User'}!
                </h1>
                <p className="text-sm text-[var(--muted)] mt-0.5">
                  Last login: First time
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Date */}
                <span className="text-sm text-[var(--muted)] hidden lg:block">
                  {new Date().toLocaleDateString('en-IN', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>

                {/* Role badge */}
                <span className="px-2.5 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold">
                  {session?.user?.role || 'USER'}
                </span>

                {/* Theme toggle */}
                <ThemeToggle />

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Page content ── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[var(--background)]">
          {children}
        </main>
      </div>
    </div>
  )
}

// ── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarContentProps {
  navigation: NavigationItem[]
  pathname: string
  onLogout: () => void
  session: Session | null
}

function SidebarContent({ navigation, pathname, onLogout, session }: SidebarContentProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">

        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4 mb-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2.5">
            <Printer className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">PrintCare</h1>
        </div>

        {/* User info */}
        <div className="px-4 py-3 mx-2 mb-2 rounded-xl bg-[var(--muted-bg)] border border-[var(--card-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {(session?.user?.username || session?.user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                {session?.user?.username || session?.user?.name || 'User'}
              </p>
              <p className="text-xs text-[var(--muted)] truncate">
                {session?.user?.role || 'USER'}
              </p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="mt-1 flex-1 px-2 space-y-0.5">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all
                  ${isActive
                    ? 'bg-[var(--sidebar-active-bg)] text-[var(--sidebar-text-active)] shadow-sm'
                    : 'text-[var(--sidebar-text)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]'
                  }
                `}
              >
                <Icon
                  className={`mr-3 h-4 w-4 shrink-0 transition-colors ${
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-[var(--muted)] group-hover:text-[var(--foreground)]'
                  }`}
                />
                {item.name}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Sign out */}
      <div className="flex-shrink-0 p-3 border-t border-[var(--sidebar-border)]">
        <button
          onClick={onLogout}
          className="group flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  )
}