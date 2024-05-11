import Image from 'next/image'
import logo from "@/assets/logo.png"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import GuestSignIn from '@/components/GuestSignIn'

export default function Home() {

  const { userId } = auth()

  if (userId) redirect('/notes')

  const guestUserEmail = process.env.GUEST_USER_EMAIL
  const guestUserPassword = process.env.GUEST_USER_PASSWORD

  return (
    <main className='flex flex-col h-screen items-center justify-center gap-5'>
      <div className='flex items-center gap-4'>
        <Image src={logo} alt='SmartNotes' width={60} height={60} />
        <span className='font-extrabold tracking-tighter text-4xl xl:text-5xl'>SmartNotes</span>
      </div>
      <p className='text-center max-w-lg'>
        An intellegent note-taking app with AI integration, built with OpenAi, Pinecone, Next.js, Clerk, Shadcn UI, and more.
      </p>
      <Button asChild>
        <Link href='/notes'>
          Sign Up
        </Link>
      </Button>
      {guestUserEmail && guestUserPassword && <GuestSignIn guestEmail={guestUserEmail} guestPassword={guestUserPassword} />}
    </main>
  )
}
