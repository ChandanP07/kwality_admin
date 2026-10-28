// app/dashboard/admin/layout.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ROLES } from '@/lib/roles'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== ROLES.ADMIN && session.user.role !== ROLES.SUPER_ADMIN)) {
    redirect('/dashboard/unauthorized')
  }

  return <>{children}</>
}