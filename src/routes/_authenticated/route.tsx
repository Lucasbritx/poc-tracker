import { createFileRoute, Outlet, useNavigate, useLocation } from '@tanstack/react-router'
import { useSupabaseAuth } from '@/auth/supabase'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const auth = useSupabaseAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      navigate({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  }, [auth.isLoading, auth.isAuthenticated, navigate, location.href])

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (!auth.isAuthenticated) {
    return null
  }

  return <Outlet />
}
