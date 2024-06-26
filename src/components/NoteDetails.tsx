import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import LoadingButton from './ui/loading-button'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Note } from '@prisma/client'
import { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from './ui/alert-dialog'
import { Trash } from 'lucide-react'
import { Button } from './ui/button'

interface Props {
    open: boolean,
    setOpen: (open: boolean) => void,
    setOpenEdit: (open: boolean) => void,
    note: Note
}

const NoteDetails = ({ open, setOpen, setOpenEdit, note }: Props) => {

    const router = useRouter()
    const [deleteLoading, setDeleteLoading] = useState(false)

    async function deleteNote() {
        setDeleteLoading(true)
        try {
            const response = await fetch('api/notes', {
                method: 'DELETE',
                body: JSON.stringify({
                    id: note.id
                })
            })
            if (!response.ok) throw Error("Status code: " + response.status)
            router.refresh()
            setOpen(false)
        } catch (error: any) {
            console.log(error)
            if (error.message === 'Status code: 401') {
                toast.error("Changes were not saved, please log in to perform this action.")
            } else {
                toast.error("Changes could not be saved.")
            }
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
                    variant='outline'>
                    <Trash />
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
                        <DialogTitle>{note.title}</DialogTitle>
                    </DialogHeader>
                    <p className='whitespace-pre-line break-words overflow-y-auto max-h-[500px]'>{note.content}</p>
                    <DialogFooter>
                        {deleteDialog}
                        <Button onClick={() => {
                            setOpen(false)
                            setOpenEdit(true)
                        }}>Edit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default NoteDetails