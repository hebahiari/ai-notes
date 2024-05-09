import { useState } from "react"
import AIChatBox from "./AIChatBox"
import { Button } from "./ui/button"
import { Bot } from "lucide-react"

const AIChatButton = () => {
    const [openChatBox, setOpenChatBox] = useState(false)
    return (
        <>
            <Button onClick={() => setOpenChatBox(true)}>
                <Bot size={20} className="mr-2" />
                AI Chat
            </Button>
            <AIChatBox open={openChatBox} onClose={() => setOpenChatBox(false)} />
        </>
    )
}

export default AIChatButton