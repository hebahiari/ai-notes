import { cn } from '@/lib/utils';
import { useChat } from 'ai/react'
import { XCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

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
            <button onClick={onClose} className='mb-1 ms-auto block'>
                <XCircle size={30} />
            </button>
            <div className='flex h-[600px] flex-col rounded bg-background border shadow-lg'>
                <div className='h-full'>Messages</div>
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