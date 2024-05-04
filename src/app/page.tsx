import Image from 'next/image'
import logo from "@/assets/logo.png"


export default function Home() {
  return (
    <main className='flex flex-col h-screen items-center justify-center gap-5'>
      <div className='flex items-center gap-4'>
        <Image src={logo} alt='SmartNotes' width={60} height={60} />
        <span className='font-extrabold tracking-tighter text-4xl xl:text-5xl'>SmartNotes</span>
      </div>
    </main>
  )
}
