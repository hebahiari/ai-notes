import { createNoteSchema, NoteSchema } from '@/lib/validation/node'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import LoadingButton from './ui/loading-button'

interface Props {
  open: boolean,
  setOpen: (open: boolean) => void,
}

const AddNoteDialog = ({ open, setOpen }: Props) => {

  const form = useForm<NoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: { title: '', content: '' }
  })

  async function onSubmit(input: NoteSchema) {
    alert(JSON.stringify(input))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your note title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Enter your note content' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton type='submit' loading={form.formState.isSubmitting}>
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddNoteDialog