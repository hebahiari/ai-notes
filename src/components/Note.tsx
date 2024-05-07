'use client'

import { Note as NoteModel } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { useState } from "react"
import NoteForm from "./NoteForm"
import { Edit } from "lucide-react"

interface Props {
    note: NoteModel
}
const Note = ({ note }: Props) => {

    const [showNoteForm, setShowNoteForm] = useState(false)

    const updatedNote = note.updatedAt > note.createdAt
    const time = (updatedNote ? note.updatedAt : note.createdAt).toDateString()
    return (
        <>
            <Card className='hover:shadow-lg transition-shadow'>
                <CardHeader>
                    <CardTitle className='flex justify-between items-start'>
                        {note.title}
                        <button onClick={() => setShowNoteForm(true)}>
                            <Edit color='grey' height={15} />
                        </button>
                    </CardTitle>
                    <CardDescription>
                        {time}
                        {updatedNote && ' (updated)'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-line">{note.content}</p>
                </CardContent>
            </Card>
            <NoteForm
                open={showNoteForm}
                noteToEdit={note}
                setOpen={setShowNoteForm} />
        </>
    )
}

export default Note