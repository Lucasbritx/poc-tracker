import PocCard from '@/components/PocCard'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { createServerSupabaseClient } from '@/lib/supabase.server'

// Server function to fetch POCs
const getPocs = createServerFn({ method: 'GET' }).handler(async ({ request }) => {
  const cookieHeader = request.headers.get('cookie') || ''
  const supabase = createServerSupabaseClient(cookieHeader)
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    console.log('No session on server')
    return []
  }

  const { data, error } = await supabase
    .from('pocs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pocs:', error)
    return []
  }

  console.log('Fetched pocs on server:', data?.length || 0, 'items')
  return data ?? []
})

// Server function to update POC task
const updatePocTask = createServerFn({ method: 'POST' })
  .inputValidator((data: { pocId: string; taskTitle: string }) => data)
  .handler(async ({ data: { pocId, taskTitle }, request }) => {
    const cookieHeader = request.headers.get('cookie') || ''
    const supabase = createServerSupabaseClient(cookieHeader)
    
    const { data: pocData, error: fetchError } = await supabase
      .from('pocs')
      .select('todo')
      .eq('id', pocId)
      .single()

    if (fetchError) {
      console.error('Error fetching poc:', fetchError)
      throw fetchError
    }

    const updatedTodo = pocData.todo.map((task: { title: string; done: boolean }) =>
      task.title === taskTitle ? { ...task, done: true } : task
    )

    const { error: updateError } = await supabase
      .from('pocs')
      .update({ todo: updatedTodo })
      .eq('id', pocId)

    if (updateError) {
      console.error('Error updating poc task:', updateError)
      throw updateError
    }

    console.log('Poc task updated successfully')
    return { success: true }
  })

export const Route = createFileRoute('/_authenticated/')({
  loader: async () => {
    const pocs = await getPocs()
    return { pocs }
  },
  component: App,
})

function App() {
  const { pocs } = Route.useLoaderData()
  const router = useRouter()

  const completePocTask = async (pocId: string, taskTitle: string) => {
    try {
      await updatePocTask({ data: { pocId, taskTitle } })
      // Invalidate and refetch the route data
      await router.invalidate()
    } catch (error) {
      console.error('Error completing task:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="p-4 flex gap-4">
        {pocs.map((poc) => {
          return <PocCard completePocTask={completePocTask} key={poc.id} poc={poc} />
        })}
      </div>
    </div>
  )
}
