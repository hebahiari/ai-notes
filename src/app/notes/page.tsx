import AddNote from "@/components/AddNote";
import Note from "@/components/Note";
import SearchBar from "@/components/SearchBar";
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
      <SearchBar />
      {allNotes.map((note) => (
        <Note note={note} key={note.id} />
      ))}
      {allNotes.length === 0 && (
        <div className="col-span-full text-center mt-5">
          No notes yet.
          <AddNote type='text' />
          to get started.
        </div>
      )}
    </div>
  )
};

export const metadata: Metadata = {
  title: "SmartNotes - Your Notes",
};

export default Notes;
