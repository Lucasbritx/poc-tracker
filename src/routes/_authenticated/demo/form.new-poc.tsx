import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { useAppForm } from '@/hooks/demo.form'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/_authenticated/demo/form/new-poc')({
  component: NewPoc,
})

const schema = z.object({
  nome: z.string().min(1, 'Name is required'),
  github_url: z.string().min(1, 'Github url is required'),
  //todos: z.array(z.string()).min(1, 'At least one todo is required'),
})

function NewPoc() {
  const form = useAppForm({
    defaultValues: {
      nome: '',
      github_url: '',
      todos: [],
    },
    validators: {
      onBlur: schema,
    },
    onSubmit: ({ value }) => {
      console.log(value)
      createPoc();
      alert('Form submitted successfully!')
    },
  })

  async function createPoc() {
    const { data, error } = await supabase
      .from('pocs')
      .insert({
        nome: 'Minha POC 1',
        todo: [
          { title: 'Criar layout', done: false },
          { title: 'Configurar backend', done: false },
        ],
        status: 'pending',
        github_url: 'https://github.com/user/repo',
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()

    console.log({ data, error })
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-white"
      style={{
        backgroundImage:
          'radial-gradient(50% 50% at 5% 40%, #add8e6 0%, #0000ff 70%, #00008b 100%)',
      }}
    >
      <div className="w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6"
        >
          <form.AppField name="nome">
            {(field) => <field.TextField label="Title" />}
          </form.AppField>

          <form.AppField name="github_url">
            {(field) => <field.TextField label="Github Url" />}
          </form.AppField>

          <form.AppField name="todos">
            {(field) => <field.TextField label="Todos" />}
          </form.AppField>

          <div className="flex justify-end">
            <form.AppForm>
              <form.SubscribeButton label="Submit" />
            </form.AppForm>
          </div>
        </form>
      </div>
    </div>
  )
}
