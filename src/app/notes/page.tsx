import Note from "@/components/Note";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import React from "react";

const Notes = async () => {

  const { userId } = auth()

  if (!userId) throw Error("userId undefined")

  const allNotes = await prisma.note.findMany({
    where: { userId }
  })

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
      {allNotes.map((note) => (
        <Note note={note} key={note.id} />
      ))}
      {allNotes.length === 0 && (
        <div className="col-span-full text-center">No notes yet. click the <b>Add Note</b> button to create a note.</div>
      )}
    </div>
  )
};

export const metadata: Metadata = {
  title: "SmartNotes - Your Notes",
};

export default Notes;
