import PocCard from '@/components/PocCard'
import { supabase } from '@/lib/supabase'
import { createFileRoute } from '@tanstack/react-router'

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

    console.log('Fetched pocs:', data)
    return { pocs: data ?? [] }
  },

  component: App,
})

function App() {
  const { pocs } = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="space-y-4">
        {pocs.map((poc) => {
          return <PocCard key={poc.id} poc={poc} />
        })}
      </div>
    </div>
  )
}
