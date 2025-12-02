import { supabaseServer } from '@/lib/supabase-server'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  loader: async ({ context }) => {
    const supabase = supabaseServer(context.request)

    const { data, error } = await supabase
      .from('pocs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      throw new Error(error.message)
    }

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
          {/* <PocCard key={poc.id} poc={poc} /> */}
          
          return (
          <>{poc.nome}</>
        )})}
      </div>
    </div>
  )
}
