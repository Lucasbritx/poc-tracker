import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import * as TanstackQuery from './integrations/tanstack-query/root-provider'
import { SupabaseAuthProvider, useSupabaseAuth } from './auth/supabase'
import type { SupabaseAuthState } from './auth/supabase'
import { useEffect } from 'react'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

export type { SupabaseAuthState }

function InnerWrap({ 
  children, 
  router, 
  rqContext 
}: { 
  children: React.ReactNode
  router: any
  rqContext: any
}) {
  const auth = useSupabaseAuth()
  
  useEffect(() => {
    router.update({
      context: {
        ...rqContext,
        auth,
      },
    })
  }, [auth, router, rqContext])

  return <>{children}</>
}

export const getRouter = () => {
  const rqContext = TanstackQuery.getContext()

  const router = createRouter({
    routeTree,
    context: { 
      ...rqContext,
      auth: undefined!,
    },
    defaultPreload: 'intent',
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <SupabaseAuthProvider>
          <TanstackQuery.Provider {...rqContext}>
            <InnerWrap router={router} rqContext={rqContext}>
              {props.children}
            </InnerWrap>
          </TanstackQuery.Provider>
        </SupabaseAuthProvider>
      )
    },
  })

  setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient })

  return router
}
