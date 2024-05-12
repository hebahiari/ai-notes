'use client'

import Image from "next/image"
import Link from "next/link"
import logo from "@/assets/logo.png"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import NoteForm from "@/components/NoteForm"
import ThemeToggleButton from "@/components/ThemeToggleButton"
import { dark } from '@clerk/themes'
import { useTheme } from "next-themes"
import AIChatButton from "@/components/AIChatButton"
import AddNote from "@/components/AddNote"

const NavBar = () => {

  const { theme } = useTheme()

  return (
    <>
      <div className="p-4 shadow">
        <div className="flex flex-wrap items-center justify-between gap-3 m-auto max-w-7xl">
          <Link href="/notes" className="flex items-center gap-2">
            <Image src={logo} alt="SmartNotes" width={25} height={25} />
            <h1 className="font-bold text-2xl tracking-tighter">SmartNotes</h1>
          </Link>
          <div className='flex items-center gap-3'>
            <AddNote type='button' />
            <AIChatButton />
            <ThemeToggleButton />
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                baseTheme: (theme === 'dark' ? dark : undefined),
                elements: { avatarBox: { width: '2.5rem', height: '2.5rem' } }
              }}
            />
          </div>
        </div>
      </div>

    </>
  )
}

export default NavBar
