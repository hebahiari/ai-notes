import { cn } from '@/lib/utils';
import { useChat } from 'ai/react'
import { Bot, XCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Message } from 'ai';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

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
                <div className='h-full mt-9 px-3 py-3 overflow-y-auto'>
                    {messages.map((message) => (
                        <ChatMessage message={message} key={message.id} />
                    ))}
                </div>
                <form onSubmit={handleSubmit} className='m-3 flex gap-2'>
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder='Say something...'
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

function ChatMessage({ message: { role, content } }: { message: Message }) {

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
                'whitespace-pre-line rounded-lg border px-3 py-2',
                isAIMessage ? 'bg-background' : 'bg-primary text-primary-foreground'
            )}
            >
                {content}
            </p>
            {isAIMessage && <Bot className='ml-2 shrink-0' size={30} />}
        </div>
    )
}