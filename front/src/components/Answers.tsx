import React from 'react'
import { QUESTION, ANSWER } from './types'

export default function Answers(
    { question, selectedAnswers, setSelectedAnswers, handleSubmitAnswers, isCorrect }: {
        question: QUESTION, selectedAnswers: ANSWER[], setSelectedAnswers: React.Dispatch<React.SetStateAction<ANSWER[]>>, handleSubmitAnswers: (answers: ANSWER[]) => void, isCorrect: boolean | null
    }
) {

    const renderAnswers = () => {

        const renderAnswerText = (answer: ANSWER) => {
            const [isSelected, setIsSelected] = React.useState(false)
            const [styleName, setStyleName] = React.useState('answer-text')


            const handleClick = () => {
                setIsSelected(prevState => !prevState);
            };


            if (answer.answerText.length === 0) {
                return <></>
            }
            if (answer.answerImages?.length < 1) {
                return (

                    <button className="answer-text" style={{
                        backgroundColor: isSelected ? 'green' : 'white',
                    }} onClick={handleClick} >
                        {renderAnswerImages(answer)}
                        <div>
                            {answer.answerText}
                        </div>
                    </ button>
                )
            }
            else {
                return (
                    <button className="answer-text-with-images" style={{
                        backgroundColor: isSelected ? 'green' : 'white',
                    }} onClick={handleClick} >
                        {renderAnswerImages(answer)}
                        <div>
                            {answer.answerText}
                        </div>
                    </ button>)
            }
        }
        const renderAnswerImages = (answer: ANSWER) => {
            if (answer.answerImages.length === 0) {
                return <></>
            }
            return (
                <div className="answer-images">
                    {answer.answerImages.map((img, i) => {
                        if (typeof img === 'string') {
                            if (img?.includes('type')) {
                                return <img className="image-answer-type" key={i} src={img} alt='' />
                            }
                            return <img className="image-answer" key={i} src={img} alt='' />
                        }
                    })}
                </div>
            )
        }
        const renderAnswerAudios = (answer: ANSWER) => {
            if (answer.answerAudios.length === 0) {
                return <></>
            }
            return (
                <div className="answer-audios">
                    {answer.answerAudios.map((audio, i) => {
                        return <div className="audio-answer" key={i}>
                            <button className="add-audio-button" onClick={() => handleClickOnAnswer(answer)}>Elegir audio</button>

                            <audio key={i} src={audio} controls />
                        </div>
                    })}
                </div>
            )
        }

        const handleClickOnAnswer = (answer: ANSWER) => {
            if (!question.allowsMultipleAnswers) {
                setSelectedAnswers([answer])
                handleSubmitAnswers([answer])
                return
            }
            if (selectedAnswers.includes(answer)) {
                setSelectedAnswers(selectedAnswers.filter(a => a !== answer))
                return
            }
            setSelectedAnswers([...selectedAnswers, answer])
        }

        return (
            <div className="answers">
                {question.answers && question.answers.map((answer, i) => {
                    return (
                        <div key={i} className="answer" onClick={() => { handleClickOnAnswer(answer) }}>
                            {renderAnswerText(answer)}
                            {renderAnswerAudios(answer)}
                        </div>
                    )
                })}
            </div>
        )
    }
    return (
        <>{isCorrect === null && renderAnswers()}</>
    )
}
