import { createNoteSchema, NoteSchema } from '@/lib/validation/node'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import LoadingButton from './ui/loading-button'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Note } from '@prisma/client'
import { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { Button } from './ui/button'

interface Props {
  open: boolean,
  setOpen: (open: boolean) => void,
  noteToEdit?: Note
}

const NoteForm = ({ open, setOpen, noteToEdit }: Props) => {

  const router = useRouter()
  const [deleteLoading, setDeleteLoading] = useState(false)

  const form = useForm<NoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteToEdit?.title || '',
      content: noteToEdit?.content || ''
    }
  })

  async function onSubmit(input: NoteSchema) {
    try {

      if (noteToEdit) {
        const response = await fetch('/api/notes', {
          method: 'PUT',
          body: JSON.stringify({
            id: noteToEdit.id,
            ...input
          })
        })
        if (!response.ok) throw Error("Status code: " + response.status)

      } else {
        const response = await fetch('/api/notes', {
          method: 'POST',
          body: JSON.stringify(input)
        })

        if (!response.ok) throw Error("Status code: " + response.status)
        form.reset()
      }

      router.refresh()
      setOpen(false)
    } catch (error: any) {
      console.log(error.message)
      if (error.message === 'Status code: 401') {
        toast.error("Changes were not saved, please log in to perform this action.")
      } else {
        toast.error("Changes could not be saved.")
      }
    }
  }

  async function deleteNote() {
    if (!noteToEdit) return
    setDeleteLoading(true)
    try {
      const response = await fetch('api/notes', {
        method: 'DELETE',
        body: JSON.stringify({
          id: noteToEdit.id
        })
      })
      if (!response.ok) throw Error("Status code: " + response.status)
      router.refresh()
      setOpen(false)
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong, please try again.")
    } finally {
      setDeleteLoading(false)
    }
  }

  const deleteDialog = (
    <AlertDialog>
      <AlertDialogTrigger>
        <LoadingButton
          loading={deleteLoading}
          type='button'
          variant='destructive'
          disabled={form.formState.isSubmitting}>
          Delete
        </LoadingButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this note.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            type='button'
            onClick={deleteNote}
          >Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return (
    <>
      <Toaster />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{noteToEdit ? 'Edit Note' : 'Add Note'}</DialogTitle>
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
                      <Textarea placeholder='Enter your note content' rows={10} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className='gap-2 sm:gap-0'>
                {noteToEdit && deleteDialog}
                <LoadingButton
                  type='submit'
                  loading={form.formState.isSubmitting}
                  disabled={deleteLoading}>
                  Submit
                </LoadingButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default NoteForm