import { ChevronRight } from 'lucide-react'
import * as React from 'react'

interface IPoc {
  id: string
  nome: string
  github_url: string
  todo?: Array<{ title: string; done: boolean }>
  status?: string
  user_id?: string
  created_at?: string
}

function PocCard({
  className,
  poc,
  ...props
}: React.ComponentProps<'div'> & {
  poc: IPoc
}) {
  return (
    <div className="text-white border rounded h-32" {...props}>
      <div className="bg-red-200 p-2 text-black">{poc.nome}</div>
      <div className="flex flex-col p-2">
        {poc.todo?.map((t) => {
          return <div className='flex gap-0.5'>
            <ChevronRight />
            {t.title}</div>
        })}
      </div>
    </div>
  )
}

export default PocCard
