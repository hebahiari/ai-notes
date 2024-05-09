import { cn } from '@/lib/utils';
import { useChat } from 'ai/react'

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
        <div className={cn('bottom-0 right-0 z-10 w-full max-w-[500px] p-1 xl:right-36', open ? 'fixed' : 'hidden')}>
            AIChatBox
        </div>
    )
}

export default AIChatBox