'use client'

import { Note as NoteModel } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { useState } from "react"
import NoteForm from "./NoteForm"
import { Edit } from "lucide-react"
import NoteDetails from "./NoteDetails"

interface Props {
    note: NoteModel
}
const Note = ({ note }: Props) => {

    const [showNoteForm, setShowNoteForm] = useState(false)
    const [showNoteDetails, setShowNoteDetails] = useState(false)

    const updatedNote = note.updatedAt > note.createdAt
    const time = (updatedNote ? note.updatedAt : note.createdAt).toDateString()

    return (
        <div className='cursor-pointer'>
            <Card className='hover:shadow-md transition-shadow h-96 overflow-y-auto' onClick={() => setShowNoteDetails(true)}>
                <CardHeader>
                    <CardTitle className='flex justify-between items-start'>
                        {note.title}
                        <button onClick={(event) => {
                            event.stopPropagation();
                            setShowNoteForm(true)
                        }}>
                            <Edit color='grey' height={15} />
                        </button>
                    </CardTitle>
                    <CardDescription>
                        {time}
                        {updatedNote && ' (updated)'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-line break-words">{note.content}</p>
                </CardContent>
            </Card>
            <NoteForm
                open={showNoteForm}
                noteToEdit={note}
                setOpen={setShowNoteForm} />
            <NoteDetails
                open={showNoteDetails}
                note={note}
                setOpenEdit={setShowNoteForm}
                setOpen={setShowNoteDetails}
            />
        </div>
    )
}

export default Note