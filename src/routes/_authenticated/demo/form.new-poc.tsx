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
  todos: z.array(z.string()).min(1, 'At least one todo is required'),
})

function NewPoc() {
  const form = useAppForm({
    defaultValues: {
      nome: '',
      github_url: '',
      todos: [],
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      console.log('value - ', value)
      await createPoc(value)
      alert('Form submitted successfully!')
    },
  })

  async function createPoc(formData: {
    nome: string
    github_url: string
    todos: string[]
  }) {
    const { data, error } = await supabase
      .from('pocs')
      .insert({
        nome: formData.nome,
        todo: formData.todos.map((title) => ({ title, done: false })),
        status: 'pending',
        github_url: formData.github_url,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()

    if (error) {
      console.error('Error creating POC:', error)
      alert('Error creating POC: ' + error.message)
    } else {
      console.log('POC created successfully:', data)
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-white"
      style={{
        backgroundImage:
          'radial-gradient(50% 50% at 5% 40%, #add8e6 0%, #0000ff 70%, #00008b 100%)',
      }}
    >
      <div className="w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-blue/50 shadow-xl border-8 border-black/10">
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

          <form.AppField name="todos" mode="array">
            {(field) => {
              return (
                <div>
                  <label className="block mb-2">Todos:</label>
                  {field.state.value.map((_, i) => {
                    return (
                      <form.AppField key={i} name={`todos[${i}]`}>
                        {(subField) => {
                          return (
                            <div className="mb-2">
                              <input
                                className="text-black p-2 rounded"
                                value={subField.state.value}
                                onChange={(e) =>
                                  subField.handleChange(e.target.value)
                                }
                                placeholder={`Todo ${i + 1}`}
                              />
                            </div>
                          )
                        }}
                      </form.AppField>
                    )
                  })}
                  <button
                    onClick={() => field.pushValue('')}
                    type="button"
                    className="bg-blue-500 px-4 py-2 rounded mt-2"
                  >
                    Add todo
                  </button>
                </div>
              )
            }}
          </form.AppField>

          <form.Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
              errors: state.errors,
              values: state.values,
            })}
          >
            {(state) => (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!state.canSubmit || state.isSubmitting}
                  className="bg-green-500 px-6 py-2 rounded hover:bg-green-600"
                >
                  {state.isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            )}
          </form.Subscribe>
        </form>
      </div>
    </div>
  )
}
