import { notesIndex } from "@/lib/db/pinecone"
import prisma from "@/lib/db/prisma"
import { getEmbedding } from "@/lib/openai"
import { createNoteSchema, deleteNoteSchema, updateNoteSchema } from "@/lib/validation/node"
import { auth } from "@clerk/nextjs"
import { NextApiRequest, NextApiResponse } from 'next';


export async function POST(req: Request) {
    try {
        const { userId } = auth()

        if (userId === 'user_2gKcQJfvLB3w0F62yylesv8Yzsv') {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const validation = createNoteSchema.safeParse(body)

        if (!validation.success) {
            console.error(validation.error)
            return Response.json({ error: 'Invalid input' }, { status: 400 })
        }

        const { title, content } = validation.data

        if (!userId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const embedding = await getEmbeddingForNote(title, content)

        if (!embedding) throw Error('could not create embedding')

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
        const { userId } = auth()

        if (userId === 'user_2gKcQJfvLB3w0F62yylesv8Yzsv') {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const validation = updateNoteSchema.safeParse(body)

        if (!validation.success) {
            console.error(validation.error)
            return Response.json({ error: 'Invalid input' }, { status: 400 })
        }

        const { id, title, content } = validation.data

        // note exists
        const note = await prisma.note.findUnique({ where: { id } })

        if (!note) {
            return Response.json({ error: 'Note not found' }, { status: 404 })
        }

        // authorized logged in user
        if (!userId || userId !== note.userId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const embedding = await getEmbeddingForNote(title, content)

        if (!embedding) throw Error('could not create embedding')

        const updatedNote = await prisma.$transaction(async (tx) => {
            const updatedNote = await tx.note.update({
                where: { id },
                data: {
                    title,
                    content
                }
            })

            await notesIndex.upsert([
                {
                    id,
                    values: embedding,
                    metadata: { userId }
                }
            ])

            return updatedNote
        })

        return Response.json({ updatedNote }, { status: 200 })

    } catch (error) {
        console.log(error)
        return Response.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {

        const { userId } = auth()

        if (userId === 'user_2gKcQJfvLB3w0F62yylesv8Yzsv') {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const validation = deleteNoteSchema.safeParse(body)

        if (!validation.success) {
            console.error(validation.error)
            return Response.json({ error: 'Invalid input' }, { status: 400 })
        }

        const { id } = validation.data

        // note exists
        const note = await prisma.note.findUnique({ where: { id } })

        if (!note) {
            return Response.json({ error: 'Note not found' }, { status: 404 })
        }

        // authorized logged in user
        if (!userId || userId !== note.userId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.$transaction(async (tx) => {
            await tx.note.delete({ where: { id } })

            await notesIndex.deleteOne(id)
        })


        return Response.json({ message: 'Note deleted' }, { status: 200 })

    } catch (error) {
        console.log(error)
        return Response.json({ error: 'Internal server error' }, { status: 500 })
    }
}

async function getEmbeddingForNote(title: string, content: string | undefined) {
    return getEmbedding(title + '\n\n' + content ?? '')
}


export async function GET(req: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const url = new URL(req.url);
        const search = url.searchParams.get('search');

        console.log(search)

        if (!search || search.trim().length === 0) {
            return new Response(JSON.stringify({ error: 'Invalid search parameter' }), { status: 400 });
        }

        console.log({ search })

        const notes = await prisma.note.findMany({
            where: {
                userId: userId,
                OR: [
                    {
                        title: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        content: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
        });

        return new Response(JSON.stringify(notes), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}