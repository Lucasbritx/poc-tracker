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
  completePocTask,
  ...props
}: React.ComponentProps<'div'> & {
  poc: IPoc
  completePocTask: (pocId: string, taskTitle: string) => Promise<void>
}) {
  return (
    <div className="text-white border rounded h-full" {...props}>
      <div className="bg-red-200 p-2 text-black">{poc.nome}</div>
      <div className="flex flex-col p-2">
        {poc.todo?.map((t) => {
          return <div key={t.title} className='flex gap-0.5'>
            {
              // todo change to checkbox
            }
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => completePocTask(poc.id, t.title)}
            />
            {t.title}</div>
        })}
      </div>
    </div>
  )
}

export default PocCard
