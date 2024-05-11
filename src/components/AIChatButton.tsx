import { useState } from "react"
import AIChatBox from "./AIChatBox"
import { Button } from "./ui/button"
import { Bot } from "lucide-react"

const AIChatButton = () => {
    const [openChatBox, setOpenChatBox] = useState(false)
    return (
        <>
            <Button size='sm' onClick={() => setOpenChatBox(true)}>
                <Bot size={20} className="mr-2" />
                AI Chat
            </Button>
            {!openChatBox &&
                <div>
                    <Button
                        variant='outline'
                        className="fixed bottom-2  max-w-7xl right-2 sm:right-auto"
                        onClick={() => setOpenChatBox(true)}>
                        <Bot />
                    </Button>
                </div>}
            <AIChatBox open={openChatBox} onClose={() => setOpenChatBox(false)} />
        </>
    )
}

export default AIChatButton