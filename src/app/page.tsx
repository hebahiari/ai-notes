import Image from 'next/image'
import logo from "@/assets/logo.png"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'


export default function Home() {

  const { userId } = auth()

  if (userId) redirect('/notes')

  return (
    <main className='flex flex-col h-screen items-center justify-center gap-5'>
      <div className='flex items-center gap-4'>
        <Image src={logo} alt='SmartNotes' width={60} height={60} />
        <span className='font-extrabold tracking-tighter text-4xl xl:text-5xl'>SmartNotes</span>
      </div>
      <p className='text-center max-w-prose'>
        An intellegent note-taking app with AI integration, built with OpenAi, Pinecone, Next.js, Cleck, Shadcn IO, and more.
      </p>
      <Button asChild>
        <Link href='/notes'>
          Try Now!
        </Link>
      </Button>
    </main>
  )
}
