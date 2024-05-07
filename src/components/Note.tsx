import { Note as NoteModel } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

interface Props {
    note: NoteModel
}
const Note = ({ note }: Props) => {
    const updatedNote = note.updatedAt > note.createdAt
    const time = (updatedNote ? note.updatedAt : note.createdAt).toDateString()
    return (
        <Card>
            <CardHeader>
                <CardTitle>{note.title}</CardTitle>
                <CardDescription>
                    {time}
                    {updatedNote && ' (updated)'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="whitespace-pre-line">{note.content}</p>
            </CardContent>
        </Card>
    )
}

export default Note