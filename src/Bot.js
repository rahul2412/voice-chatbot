import React, { useState } from 'react'
import './Bot.css'
import Chat from './Chat'

export default function Bot() {
    const [showBot, setShowBot] = useState(false)
    
    return (
        <>
            {!showBot && <div className='bot-container' onClick={() => setShowBot(true)}>
            </div>
            }
            {
                showBot && <Chat closeBot={() => setShowBot(false)} />
            }
        </>
    )
}
