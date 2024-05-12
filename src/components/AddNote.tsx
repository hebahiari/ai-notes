'use client'

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import NoteForm from "@/components/NoteForm"

interface Props {
    type: 'button' | 'text'
}

const AddNote = ({ type }: Props) => {

    const [showNoteForm, setShowNoteForm] = useState(false)

    return (
        <>
            {type === 'button' && (
                <Button size='sm' onClick={() => setShowNoteForm(true)}>
                    <Plus size={20} className="mr-2" />
                    Add Note
                </Button>
            )}
            {type === 'text' && (
                <span
                    onClick={() => setShowNoteForm(true)}
                    className='font-bold underline cursor-pointer'>Create a new note</span >
            )}
            <NoteForm open={showNoteForm} setOpen={setShowNoteForm} />
        </>
    )
}

export default AddNote