import { SubmitHandler } from 'react-hook-form'
import * as z from 'zod'
import {
  TextFieldType,
  SwitcherFieldType,
  FieldViews,
  FormWithData,
} from '@/components/ui/form-with-data'

const schema = z.object({
  username: z.string({
    required_error: 'Required field',
  }),
  password: z.string({
    required_error: 'Required field',
  }),
  remember: z.boolean(),
})

type FormSchema = z.infer<typeof schema>

const initialFormValues: FormSchema = {
  username: '',
  password: '',
  remember: false,
}

const fields = [
  {
    name: 'username',
    label: 'Username*',
    description: 'Username specified during registration',
    view: FieldViews.text,
  } as TextFieldType<FormSchema>,
  {
    name: 'password',
    label: 'Password*',
    view: FieldViews.text,
    attributes: {
      type: 'password',
    },
  } as TextFieldType<FormSchema>,
  {
    name: 'remember',
    label: 'Remember session?',
    view: FieldViews.switcher,
  } as SwitcherFieldType<FormSchema>,
]

function App() {
  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    alert(JSON.stringify(data).split(',').join(',\n'))
  }

  return (
    <FormWithData<typeof schema>
      name="login"
      title="Login"
      fields={fields}
      schema={schema}
      defaultValues={initialFormValues}
      onSubmit={onSubmit}
    />
  )
}

export default App
