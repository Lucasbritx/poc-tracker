import PocCard from '@/components/PocCard'
import { supabase } from '@/lib/supabase'
import { createFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  loader: async () => {
    const { data, error } = await supabase
      .from('pocs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching pocs:', error)
      return { pocs: [] }
    }

    console.log('Fetched pocs:', data?.length || 0, 'items')
    return { pocs: data ?? [] }
  },

  component: App,
})

function App() {
  const { pocs } = Route.useLoaderData();
  const router = useRouter();

  const completePocTask = async (pocId: string, taskTitle: string) => {
    const { data: pocData, error: fetchError } = await supabase
      .from('pocs')
      .select('todo')
      .eq('id', pocId)
      .single()

    if (fetchError) {
      console.error('Error fetching poc:', fetchError)
      return
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
    } else {
      console.log('Poc task updated successfully')
      await router.invalidate()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="space-y-4 space-x-4 p-4 flex">
        {pocs.map((poc) => {
          return <PocCard completePocTask={completePocTask} key={poc.id} poc={poc} />
        })}
      </div>
    </div>
  )
}
