import * as React from 'react'
import { cn } from '@/lib/utils'

function PocCard({
  className,
  poc,
  ...props
}: React.ComponentProps<'div'> & {
  poc: any
}) {
  return <div className="" {...props} >
    {poc.nome}
  </div>
}

export default PocCard
