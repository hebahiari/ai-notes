import { notesIndex } from "@/lib/db/pinecone"
import prisma from "@/lib/db/prisma"
import { getEmbedding } from "@/lib/openai"
import { createNoteSchema, deleteNoteSchema, updateNoteSchema } from "@/lib/validation/node"
import { auth } from "@clerk/nextjs"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const validation = createNoteSchema.safeParse(body)

        if (!validation.success) {
            console.error(validation.error)
            return Response.json({ error: 'Invalid input' }, { status: 400 })
        }

        const { title, content } = validation.data
        const { userId } = auth()

        if (!userId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        let embedding = await getEmbeddingForNote(title, content)

        if (!embedding) {
            embedding = []
        }

        const note = await prisma.$transaction(async (tx) => {
            const note = await tx.note.create({
                data: {
                    title,
                    content,
                    userId
                }
            })

            await notesIndex.upsert([
                {
                    id: note.id,
                    values: embedding,
                    metadata: { userId }
                }
            ])

            return note
        })

        return Response.json({ note }, { status: 201 })

    } catch (error) {
        console.log(error)
        return Response.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json()
        const validation = updateNoteSchema.safeParse(body)

        if (!validation.success) {
            console.error(validation.error)
            return Response.json({ error: 'Invalid input' }, { status: 400 })
        }

        const { id, title, content } = validation.data
        const { userId } = auth()

        // note exists
        const note = await prisma.note.findUnique({ where: { id } })

        if (!note) {
            return Response.json({ error: 'Note not found' }, { status: 404 })
        }

        // authorized logged in user
        if (!userId || userId !== note.userId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const updatedNote = await prisma.note.update({
            where: { id },
            data: {
                title,
                content
            }
        })

        return Response.json({ updatedNote }, { status: 200 })

    } catch (error) {
        console.log(error)
        return Response.json({ error: 'Internal server error' }, { status: 500 })
    }
}


export async function DELETE(req: Request) {
    try {
        const body = await req.json()
        const validation = deleteNoteSchema.safeParse(body)

        if (!validation.success) {
            console.error(validation.error)
            return Response.json({ error: 'Invalid input' }, { status: 400 })
        }

        const { id } = validation.data
        const { userId } = auth()

        // note exists
        const note = await prisma.note.findUnique({ where: { id } })

        if (!note) {
            return Response.json({ error: 'Note not found' }, { status: 404 })
        }

        // authorized logged in user
        if (!userId || userId !== note.userId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const updatedNote = await prisma.note.delete({ where: { id } })

        return Response.json({ message: 'Note deleted' }, { status: 200 })

    } catch (error) {
        console.log(error)
        return Response.json({ error: 'Internal server error' }, { status: 500 })
    }
}

async function getEmbeddingForNote(title: string, content: string | undefined) {
    return getEmbedding(title + '\n\n' + content ?? '')
}