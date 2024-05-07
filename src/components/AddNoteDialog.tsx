import { createNoteSchema, NoteSchema } from '@/lib/validation/node'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'

interface Props {
  open: boolean,
  setOpen: (open: boolean) => void,

}

const AddNoteDialog = ({ open, setOpen }: Props) => {

  const form = useForm<NoteSchema>({
    resolver: zodResolver(createNoteSchema)
  })

  async function onSubmit(input: NoteSchema) {
    alert(input)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AddNoteDialog