import React from 'react'
import './Chat.css'
import butter from './butter.png'
import { useState, useEffect } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const numbersInEnglish = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
};

const initialText1 = 'Good evening sir, welcome to ButterScotch !!'
const initialText2 = 'What would you like to eat today?'
const initialText3 = 'We have Burgers, Pizzas, Fries and much more'

const defaultOrder = {
    'pizzas': 0,
    'burgers': 0,
    'fries': 0,
    'coffee': 0,
    'coke': 0
}

const cost = {
    'pizzas': 11.99,
    'burgers': 5.99,
    'fries': 4.49,
    'coffee': 2.49,
    'coke': 1.99
}


export default function Chat(props) {
    const { speak } = useSpeechSynthesis();
    const {
        transcript,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const [loaded, setLoaded] = useState(false)
    const [recording, setRecording] = useState(false)
    const [order, setOrder] = useState(defaultOrder)
    const [mainOrder, setMainOrder] = useState('')
    const [addOrder, setAddOrder] = useState('')
    const [showFinalMessage, setShowFinalMessage] = useState(false)
    const [finalOrder, setFinalOrder] = useState([])
    const [totalCost, setTotalCost] = useState(0)

    useEffect(() => {
        setLoaded(true)
    }, [])

    useEffect(() => {
        if (loaded) {
            speak({ text: initialText1 })
            speak({ text: initialText2 })
            speak({ text: initialText3 })

            setLoaded(false)
        }
    }, [loaded])

    useEffect(() => {
        if (recording) {
            setMainOrder(transcript)
            const orderText = transcript.toLowerCase()
            let temp_order = { ...order }

            for (const item in defaultOrder) {
                let i = orderText.indexOf(item)
                let food = item

                if (i != -1) {
                    for (const num in numbersInEnglish) {
                        if (orderText.substring(i - 6, i).includes(num)) {
                            temp_order[food] = numbersInEnglish[num]
                            break
                        }
                    }
                }
            }

            setRecording(false)
            speak({ text: 'Ok sir, Would you like to have a drink?' })

            setOrder(temp_order)
            let final_order = []
            let amount = 0
            for (const item in temp_order) {

                amount += cost[item] * temp_order[item]
                if (temp_order[item] > 0) {
                    final_order.push(temp_order[item] + ' ' + item + ' ')
                }
            }

            amount = Math.round(amount * 100) / 100

            setFinalOrder(final_order)
            setTotalCost(amount)


        }
    }, [recording])

    const stopRecording = () => {
        SpeechRecognition.stopListening()
        setRecording(true)
    }

    const addToOrder = () => {
        setAddOrder(transcript)
        setShowFinalMessage(true)

        let finalOrderText = 'Sir, your order is '

        finalOrder.forEach(item => {
            finalOrderText += item
        }
        )

        const costText = 'And your total is $' + totalCost

        speak({ text: finalOrderText })
        speak({ text: costText })
        speak({ text: 'Thank you and have a nice day !!' })
    }

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <div className='chat-container'>
            <div className='bot-top-container'>
                <div>
                    <span style={{ paddingLeft: '5px' }}>
                        <img src={butter} height={60} width={60} />
                    </span>
                    <span style={{ fontSize: '20px', paddingLeft: '30px' }}>
                        <b>ButterScotch</b>
                    </span>
                    <span style={{ fontSize: '25px', position: 'absolute', right: '7px', top: '7px', cursor: 'pointer' }} onClick={props.closeBot}>
                        X
                    </span>
                </div>
            </div>
            <hr />

            <div className='chatbox'>
                <div>
                    {initialText1}<br />
                    {initialText2}
                </div>
                <br />
                <div>
                    Our menu:<ol>
                        <li>Burger ${cost.burgers}</li>
                        <li>Pizza ${cost.pizzas}</li>
                        <li>Fries ${cost.fries}</li>
                        <li>Coffee ${cost.coffee}</li>
                        <li>Coke ${cost.coke}</li>
                    </ol>
                </div>
                <div>
                    <button onClick={SpeechRecognition.startListening}>Start</button>
                    <button onClick={stopRecording}>Stop</button>
                    <p>{mainOrder}</p>
                </div>


                {/* to print entire object
                <pre>
                {JSON.stringify(order, null, 2)}
            </pre> */}

                {mainOrder.length > 0 && <div>
                    <div>
                        Ok sir, Would you like to have a drink?
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <button onClick={SpeechRecognition.startListening}>Start</button>
                        <button onClick={addToOrder}>Stop</button>
                        <p>{addOrder}</p>
                    </div>
                </div>
                }
                {
                    showFinalMessage && <div>
                        <div>Sir, your order is: {finalOrder.map((item) =>
                            <span>{item}</span>
                        )
                        }
                        </div>
                        <div>
                            And your total is ${totalCost}.
                        </div> <br />
                        <div>
                            Thank you and have a nice day !!
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
