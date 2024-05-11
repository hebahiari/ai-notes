import { cn } from '@/lib/utils';
import { useChat } from 'ai/react'
import { Bot, Trash, XCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Message } from 'ai';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface Props {
    open: boolean;
    onClose: () => void
}

const AIChatBox = ({ open, onClose }: Props) => {
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        setMessages,
        isLoading,
        error
    } = useChat()

    const inputRef = useRef<HTMLInputElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    useEffect(() => {
        if (open) {
            inputRef.current?.focus()
        }
    }, [open])

    const lastMessageIsUser = messages[messages.length - 1]?.role === 'user'

    return (
        <div
            className={cn('bottom-0 right-0 z-10 w-full max-w-[500px] p-1 xl:right-36',
                open ? 'fixed' : 'hidden'
            )}
        >
            <button onClick={onClose} className='mb-1 ms-auto block absolute top-3 right-3'>
                <XCircle size={25} />
            </button>
            <div className='flex h-[600px] flex-col rounded bg-background border shadow-lg'>
                <div className='h-full mt-9 px-3 py-3 overflow-y-auto' ref={scrollRef}>
                    {messages.map((message) => (
                        <ChatMessage message={message} key={message.id} />
                    ))}
                    {isLoading && lastMessageIsUser && (
                        <ChatMessage message={{ role: 'assistant', content: '...' }} />
                    )}
                    {error && (
                        <ChatMessage
                            message={{ role: 'assistant', content: 'Something went wrong, Please try again.' }}
                        />
                    )}
                    {!error && messages.length === 0 && (
                        <div className='flex flex-col h-full items-center text-center justify-start gap-1 px-3 text-gray-400 text-md' >
                            <Bot className='shrink-0 self-center mb-2' />
                            <p>Ask me a question about your notes, here are some examples:</p>
                            <p>- What is my netflix password?</p>
                            <p>- Give me a movie to watch</p>
                            <p>- Summarize</p>
                        </div>
                    )}
                </div>
                <form onSubmit={handleSubmit} className='m-3 flex gap-2'>
                    <Button
                        title='Clear Chat'
                        variant='outline'
                        size='icon'
                        className='shrink-0'
                        type='button'
                        onClick={() => setMessages([])}
                    >
                        <Trash />
                    </Button>
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder='Say something...'
                        ref={inputRef}
                    />
                    <Button type='submit'>
                        Send
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default AIChatBox

function ChatMessage({ message: { role, content } }: { message: Pick<Message, 'role' | 'content'> }) {

    const { user } = useUser()

    const isAIMessage = role === 'assistant'

    return (
        <div className={cn(
            "mb-3 flex items-center",
            isAIMessage ? 'justify-end ms-5' : 'justify-start me-5'
        )}>
            {!isAIMessage && user?.imageUrl && (
                <Image
                    src={user.imageUrl}
                    alt='User Image'
                    width={40}
                    height={40}
                    className='mr-2 rounded-full'
                />
            )}
            <p className={cn(
                'whitespace-pre-line break-words tex rounded-lg border px-3 py-2 max-w-sm',
                isAIMessage ? 'bg-background' : 'bg-primary text-primary-foreground'
            )}
            >
                {content}
            </p>
            {isAIMessage && <Bot className='ml-2 shrink-0' size={30} />}
        </div>
    )
}