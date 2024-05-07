'use client'

import Image from "next/image"
import Link from "next/link"
import logo from "@/assets/logo.png"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import NoteForm from "@/components/NoteForm"

const NavBar = () => {

  const [showNoteForm, setShowNoteForm] = useState(false)

  return (
    <>
      <div className="p-4 shadow">
        <div className="flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href="/notes" className="flex items-center gap-3">
            <Image src={logo} alt="SmartNotes" width={20} height={20} />
            <span className="font-bold">SmartNotes</span>
          </Link>
          <div className='flex items-center gap-3'>
            <Button onClick={() => setShowNoteForm(true)}>
              <Plus size={20} className="mr-2" />
              Add Note
            </Button>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: { avatarBox: { width: '2.5rem', height: '2.5rem' } }
              }}
            />
          </div>
        </div>
      </div>
      <NoteForm open={showNoteForm} setOpen={setShowNoteForm} />
    </>
  )
}

export default NavBar
