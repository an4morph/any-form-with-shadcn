# Form with data based on @shadcn/ui

This is a React component that creates form with UI and validation. 

This is a component that can be copied to your project if you work with shadcn-ui.

Technologies used in: React, TypeScript, Tailwind, ShandcnUI, Zod, ReactHookForm

## Installation

First, you must make sure you have ShandcnUI installed. You can follow [their documentation](https://ui.shadcn.com/docs/installation), and install tailwind and path aliases

After, you should install all neccessary components with this command

```bash
npx shadcn-ui@latest add form button checkbox input textarea switch popover command radio-group selec calendar
```

And then, to install the component, copy `form-with-data.tsx` from `src/components/ui` to your project's ui folder.

## Usage

Basic usage:

```tsx
import { SubmitHandler } from 'react-hook-form'
import * as z from 'zod'
import {
  // here imports for types for fields
  TextFieldType, SwitcherFieldType, /* ... etc */
  // enum describes form field components view
  FieldViews,
  // and FormWithData component
  FormWithData 
} from '@/components/ui/form-with-data'

const schema = z.object({
  /* your form schema for validation */
})

type FormSchema = z.infer<typeof schema>

const initialFormValues: FormSchema = {
  /* initial data for your form */
}

const fields = [ /* ... */ ]

function App() {
  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    /* do smth on submit */
  }

  return (
    <FormWithData<typeof schema>
      /* form props */
    />
  )
}

export default App
```

Example with login form:

```tsx
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
      name="login-form"
      title="Login"
      fields={fields}
      schema={schema}
      defaultValues={initialFormValues}
      onSubmit={onSubmit}
    />
  )
}

export default App

```

## API

FormWithData props

```tsx
  interface FormWithDataProps<TSchema extends ZodSchema> {
    // required
    name: string
    title: string
    schema: TSchema
    defaultValues: z.infer<TSchema>
    onSubmit: SubmitHandler<z.infer<TSchema>>

    // optional
    className?: string
    submitBtnText?: string
    titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span' | 'p'

    // array with description of all form fields. Here we indicate what type the form has, and additional data 
    // learn more in the documentation below
    fields: AnyFieldType<z.infer<TSchema>>[]
  }
```

### How to create field object?

**Required props:**

All fields have required data - this is the name and view
- name - any unique string for the field
- view - one of enum FieldViews (you can import it)

```tsx
export interface FieldProps<TSchema> {
  name: Path<TSchema> // one of props in your schema
  view: FieldViews
  label?: string
  description?: string
}
```

**Other props:**

Оther properties depends on FieldViews

| Prop | Fields | Description |
| ------ | ------ | ------ |
| attributes | TextFieldType, TextAreaFieldType, SelectFieldType | all fields available in html. For example type, placeholder, cols, rows, disabled etc |
| options | CheckboxGroupFieldType, RadioGroupFieldType, SelectFieldType, ComboboxFieldType | for fields where there is a choice of answer options. This is an object with fields: id, label, value |
| checkboxLabel | CheckboxFieldType | Text after checkbox element |
| selectPlaceholder | ComboboxFieldType | Placeholder text in select |
| emptyPlaceholder | ComboboxFieldType | Text when you find nothing after search |
| searchPlaceholder | ComboboxFieldType | Text placeholder in search input |
| datePlaceholder | SimpleDateFieldType | Text placeholder in date input |


Use typing for each field so that the typescript helps to avoid mistakes in props

```tsx
const fields = [
  {
    name: 'username',
    label: 'Username*',
    description: 'Username specified during registration',
    view: FieldViews.text,
  } as TextFieldType<FormSchema>, /* use this */ 
  {
    name: 'age',
    label: 'Age',
    view: FieldViews.text,
    description: 'One field for name',
    attributes: {
      type: 'number',
    },
  } as TextFieldType<FormSchema>, /* use this */ 
  {
    name: 'about',
    label: 'About',
    view: FieldViews.textarea,
    attributes: {
      placeholder: 'Type there...',
      rows: '5',
    } as React.InputHTMLAttributes<HTMLTextAreaElement>, /* use this */ 
  } as TextAreaFieldType<FormSchema>,} /* use this */ 
]
```
