import { z, ZodSchema } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm, FieldValues, ControllerRenderProps, UseFormReturn, Path, PathValue } from 'react-hook-form'
import { ChevronsUpDown, Check, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

import { Form, FormDescription, FormField, FormLabel, FormMessage, FormControl, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components//ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'

export enum FieldViews {
  text = 'text',
  textarea = 'textarea',
  switcher = 'switcher',
  radioGroup = 'radioGroup',
  select = 'select',
  combobox = 'combobox',
  checkboxGroup = 'checkboxGroup',
  checkbox = 'checkbox',
  simpleDate = 'simpleDate'
}

export interface Option {
  id: string,
  label: string,
  value: string,
}

export interface FieldProps<TSchema> {
  name: Path<TSchema>
  view: FieldViews
  label?: string
  description?: string
}

export interface TextAreaFieldType<TSchema> extends FieldProps<TSchema> {
  attributes?: React.InputHTMLAttributes<HTMLTextAreaElement>
  view: FieldViews.textarea
}

export interface TextFieldType<TSchema> extends FieldProps<TSchema> {
  attributes?: React.InputHTMLAttributes<HTMLInputElement>
  view: FieldViews.text
}

export interface SwitcherFieldType<TSchema> extends FieldProps<TSchema> {
  view: FieldViews.switcher
}

export interface CheckboxFieldType<TSchema> extends FieldProps<TSchema> {
  checkboxLabel?: string
  view: FieldViews.checkbox
}

export interface CheckboxGroupFieldType<TSchema> extends FieldProps<TSchema> {
  options: Option[]
  view: FieldViews.checkboxGroup
}

export interface RadioGroupFieldType<TSchema> extends FieldProps<TSchema> {
  options: Option[]
  view: FieldViews.radioGroup
}

export interface SelectFieldType<TSchema> extends FieldProps<TSchema> {
  attributes?: React.InputHTMLAttributes<HTMLSelectElement>
  options: Option[]
  view: FieldViews.select
}

export interface ComboboxFieldType<TSchema> extends FieldProps<TSchema> {
  selectPlaceholder?: string
  emptyPlaceholder?: string
  searchPlaceholder?: string
  options: Option[]
  view: FieldViews.combobox
}

export interface SimpleDateFieldType<TSchema> extends FieldProps<TSchema> {
  datePlaceholder?: string
  view: FieldViews.simpleDate
}

export type AnyFieldType<TSchema> =
| TextAreaFieldType<TSchema>
| TextFieldType<TSchema>
| SwitcherFieldType<TSchema>
| CheckboxFieldType<TSchema>
| CheckboxGroupFieldType<TSchema>
| RadioGroupFieldType<TSchema>
| SelectFieldType<TSchema>
| ComboboxFieldType<TSchema>
| SimpleDateFieldType<TSchema>


interface SimpleDateFieldProps<TSchema extends FieldValues> extends Pick<SimpleDateFieldType<TSchema>, 'datePlaceholder'> {
  field: ControllerRenderProps<TSchema>
}

interface SelectFieldProps<TSchema extends FieldValues> extends Pick<SelectFieldType<TSchema>, 'attributes' | 'options'> {
  field: ControllerRenderProps<TSchema>
}

interface RadioGroupFieldProps<TSchema extends FieldValues> extends Pick<RadioGroupFieldType<TSchema>, 'options'> {
  field: ControllerRenderProps<TSchema>
}

interface ComboboxFieldProps<TSchema extends FieldValues> extends Pick<ComboboxFieldType<TSchema>,
  | 'emptyPlaceholder'
  | 'searchPlaceholder'
  | 'selectPlaceholder'
  | 'name'
  | 'options'
> {
  form: UseFormReturn<TSchema>
  field: ControllerRenderProps<TSchema>
}

interface CheckboxGroupFieldProps<TSchema extends FieldValues> extends Pick<CheckboxGroupFieldType<TSchema>, 'name' | 'options'> {
  form: UseFormReturn<TSchema>
}

interface CheckboxFieldProps<TSchema extends FieldValues> extends Pick<CheckboxFieldType<TSchema>, 'checkboxLabel'> {
  field: ControllerRenderProps<TSchema>
}


export const SimpleDateField = <TSchema extends FieldValues>({ field, datePlaceholder }: SimpleDateFieldProps<TSchema>): JSX.Element => {
  return (
    <FormItem className="flex flex-col">
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              className={cn(
                'w-full pl-3 text-left font-normal',
                !field.value && 'text-muted-foreground',
              )}
            >
              {field.value ? format(field.value, 'PPP') : <span>{datePlaceholder || 'Pick a date'}</span>}
              <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </FormItem>
  )
}

export const SelectField = <TSchema extends FieldValues>({ field, attributes, options }: SelectFieldProps<TSchema>): JSX.Element | null => {
  return (
    <Select
      onValueChange={field.onChange}
      defaultValue={field.value}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={attributes?.placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {
          options.map(({ id, label, value }) => {
            if (!value) return null
            return (
              <SelectItem
                value={String(value)}
                key={id}
              >
                {label}
              </SelectItem>
            )
          })
        }
      </SelectContent>
    </Select>
  )
}

export const RadioGroupField = <TSchema extends FieldValues>({ options, field }: RadioGroupFieldProps<TSchema>): JSX.Element | null => {
  return (
    <RadioGroup
      onValueChange={field.onChange}
      defaultValue={field.value}
    >
      {
        options.map(({ id, label, value }) => {
          if (!value) return null
          return (
            <div key={id} className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem value={String(value)} id={id} />
              <FormLabel htmlFor={id}>{label}</FormLabel>
            </div>
          )
        })
      }
    </RadioGroup>
  )
}

export const ComboboxField = <TSchema extends ZodSchema>({
  selectPlaceholder,
  searchPlaceholder,
  emptyPlaceholder,
  form,
  name,
  field,
  options,
}: ComboboxFieldProps<TSchema>): JSX.Element | null => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            id={name}
            role="combobox"
            className={cn(
              'w-full justify-between',
              !field.value && 'text-muted-foreground',
            )}
          >
            {
              field.value
                ? options.find(({ value }) => value === field.value)?.label
                : (selectPlaceholder || 'Choose one')
            }
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command
          filter={(value, search) => {
            const label = options.find(option => option.value === value)?.label
            return !label || !label.includes(search) ? 0 : 1
          }}
        >
          <CommandInput placeholder={searchPlaceholder || 'Search items...'} />
          <CommandEmpty>{emptyPlaceholder || 'No items found'}</CommandEmpty>
          <CommandGroup>
            {options.map(({ id, value, label }) => {
              if (!value) return null
              return (
                <CommandItem
                  value={value.toString()}
                  key={id}
                  onSelect={(selectedValue) => {
                    const value = selectedValue as PathValue<TSchema, Path<TSchema>>
                    form.setValue(name, value)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === field.value
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {label}
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export const CheckboxGroupField = <TSchema extends FieldValues>({ options, form, name }: CheckboxGroupFieldProps<TSchema>): JSX.Element | null => {
  return (
    <>
      {options.map((item) => {
        return (
          <FormField
            key={item.id}
            control={form.control}
            name={name}
            render={({ field }) => {
              return (
                <div
                  key={item.id}
                  className="flex flex-row items-center space-x-3"
                >
                  <FormControl>
                    <Checkbox
                      id={item.id}
                      checked={Array.from(field.value).includes(item.value)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, item.value])
                          : field.onChange(Array.from(field.value)?.filter((value) => value !== item.value))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal py-1">
                    {item.label}
                  </FormLabel>
                </div>
              )
            }}
          />
        )
      })}
    </>
  )
}

export const CheckboxField = <TSchema extends FieldValues>({ field, checkboxLabel }: CheckboxFieldProps<TSchema>): JSX.Element => {
  return (
    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <FormLabel className="font-normal">
        {checkboxLabel}
      </FormLabel>
    </FormItem>
  )
}


interface InnerFieldProps<TSchema extends ZodSchema> {
  field: ControllerRenderProps<TSchema>
  form: UseFormReturn<TSchema>
  props: AnyFieldType<TSchema>
}

export const InnerField = <TSchema extends ZodSchema>({ field, form, props }: InnerFieldProps<TSchema>): JSX.Element | null => {

  if (props.view === FieldViews.text) {
    return <Input {...props.attributes} {...field} />
  }

  if (props.view === FieldViews.textarea) {
    return <Textarea {...props.attributes} {...field} />
  }

  if (props.view === FieldViews.radioGroup) {
    const { options } = props
    return <RadioGroupField {...{ field, options }} />
  }

  if (props.view === FieldViews.switcher) {
    return (
      <Switch
        className="mt-0"
        checked={field.value}
        onCheckedChange={field.onChange}
        {...field}
      />
    )
  }

  if (props.view === FieldViews.select) {
    const { options, attributes } = props
    return (
      <SelectField {...{ field, options, attributes }} />
    )
  }

  if (props.view === FieldViews.combobox) {
    const { name, options, selectPlaceholder, searchPlaceholder, emptyPlaceholder } = props
    return (
      <ComboboxField
        {...{ name, selectPlaceholder, searchPlaceholder, emptyPlaceholder, form, field, options }}
      />
    )
  }

  if (props.view === FieldViews.checkboxGroup) {
    const { options, name } = props
    return (
      <CheckboxGroupField {...{ form, name, options }} />
    )
  }

  if (props.view === FieldViews.checkbox) {
    const { checkboxLabel } = props
    return (
      <CheckboxField {...{ field, checkboxLabel }} />
    )
  }

  if (props.view === FieldViews.simpleDate) {
    const { datePlaceholder } = props
    return (
      <SimpleDateField {...{ field, datePlaceholder }} />
    )
  }

  return null
}

interface FormWithDataProps<TSchema extends ZodSchema> {
  className?: string
  name: string
  title: string
  fields: AnyFieldType<z.infer<TSchema>>[]
  schema: TSchema
  defaultValues: z.infer<TSchema>
  onSubmit: SubmitHandler<z.infer<TSchema>>
  submitBtnText?: string
  titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span' | 'p'
}

export const FormWithData = <TSchema extends ZodSchema>({
  className,
  name,
  schema,
  fields,
  defaultValues,
  onSubmit,
  submitBtnText = 'Submit',
  titleTag: Title = 'h2',
  title,
}: FormWithDataProps<TSchema>): JSX.Element => {

  const form = useForm<TSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form
        name={name}
        className={className}
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
      >
        <Title className="text-2xl mb-4 font-medium">{title}</Title>
        <div className="flex flex-col gap-5">
          {
            fields.map((formField) => {
              return (
                <FormField<TSchema>
                  key={formField.name.toString()}
                  control={form.control}
                  name={formField.name}
                  render={({ field }) => (
                    <div>
                      {formField.label && <FormLabel className="block mb-3">{formField.label}</FormLabel>}
                      <InnerField
                        props={formField}
                        field={field}
                        form={form}
                      />
                      <FormMessage className="mt-1" />
                      {formField.description && (
                        <FormDescription className="mt-2">{formField.description}</FormDescription>
                      )}
                    </div>
                  )}
                />
              )
            })
          }
        </div>
        <Button className="mt-5 w-full" type="submit">{submitBtnText}</Button>
      </form>
    </Form>
  )
}