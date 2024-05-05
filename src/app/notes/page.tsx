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
    <div></div>
  )
};

export const metadata: Metadata = {
  title: "SmartNotes - Your Notes",
};

export default Notes;
