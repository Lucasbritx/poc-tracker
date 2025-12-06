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
  return <div className="" {...props} >
    {poc.nome}
  </div>
}

export default PocCard
