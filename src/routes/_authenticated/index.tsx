import PocCard from '@/components/PocCard'
import { supabase } from '@/lib/supabase'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/_authenticated/')({
  component: App,
})

function App() {
  const queryClient = useQueryClient()

  const { data: pocs = [], isLoading } = useQuery({
    queryKey: ['pocs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pocs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching pocs:', error)
        throw error
      }

      console.log('Fetched pocs:', data?.length || 0, 'items')
      return data ?? []
    },
  })

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
      // Invalidate the query to refetch
      queryClient.invalidateQueries({ queryKey: ['pocs'] })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading POCs...</div>
      </div>
    )
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
