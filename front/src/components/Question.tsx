import React from 'react'
import { JSX } from 'react'

import { QUESTION, ANSWER } from './types'
import JSConfetti from 'js-confetti'
import NthQuestion from './NthQuestion'
import Answers from './Answers'
const jsConfetti = new JSConfetti()
export default function Question(
    {
        question,
        score,
        setScore,
        isCorrect,
        setIsCorrect,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        quizzMode


    }
        :
        {
            question: QUESTION
            score: number
            setScore: React.Dispatch<React.SetStateAction<number>>
            isCorrect: boolean | null
            setIsCorrect: React.Dispatch<React.SetStateAction<boolean | null>>
            currentQuestionIndex: number
            setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>
            quizzMode: string
        }
) {


    const [selectedAnswers, setSelectedAnswers] = React.useState<ANSWER[]>([])

    const handleSubmitAnswers = (answers: ANSWER[]) => {
        let correctness = true;
        const expectedNumberOfCorrectAnswers = question.answers.filter(answer => answer.isCorrect).length;
        let numberOfCorrectAnswers = 0;
        for (const answer of answers) {
            if (!answer.isCorrect) {
                console.log("Incorrect answer selected:", answer);
                correctness = false;
            } else {
                console.log("Correct answer selected:", answer);
                numberOfCorrectAnswers++;
            }
        }

        console.log("Number of total expected correct answers:", expectedNumberOfCorrectAnswers);
        console.log("Total selected answers:", numberOfCorrectAnswers);
        correctness = expectedNumberOfCorrectAnswers === numberOfCorrectAnswers && correctness;

        setIsCorrect(correctness);
        if (correctness) {
            setScore(score + question.score);
            jsConfetti.addConfetti();
        }
        setSelectedAnswers([]);


    }


    const renderSubmitAnswersButton = () => {
        if (selectedAnswers.length === 0 || !question.allowsMultipleAnswers) {
            return <></>
        }
        return (
            <button className="continuar" onClick={() => { handleSubmitAnswers(selectedAnswers) }}>▽</button>
        )
    }


    const renderOnCorrect = () => {
        const renderOnCorrectText = () => {
            return (
                <h2>{question.onCorrectText}</h2>
            )
        }
        const renderOnCorrectImages = () => {
            if (question.onCorrectImages.length === 0) {
                return <></>
            }

            const str = question.questionText;


            if (question.questionText.includes("A ver si te sabes la tabla de tipos")) {
                return (
                    <div className="on-correct-images"
                        style={{
                            padding: `${question.onIncorrectImages.length === 1 ? '0 rem' : '0rem'}`,
                            gridTemplateColumns: `repeat(${Math.min(question.onIncorrectImages.length, 15)}, 1fr)`
                            ,
                            placeItems: 'center',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: question.onIncorrectText.length > 400 ? '38rem' : '25rem',

                        }}>
                        {
                            question.onCorrectImages.map((img, i) => {

                                return (
                                    <img
                                        style={{

                                            width: question.onCorrectImages[i].includes("crossed-swords") ? '50%' : '100%',
                                        }}
                                        className="image-on-correct" key={i} src={img} alt='' />
                                )
                            })
                        }</div>)
            }
            return (
                <div className="on-correct-images"
                    style={{
                        padding: `${question.onCorrectImages.length === 1 ? '0 rem' : '0rem'}`,
                        gridTemplateColumns: `repeat(${Math.min(question.onCorrectImages.length, 11)}, 1fr)`
                        ,
                        gap: question.onCorrectImages.length <= 3 ? '200px' : '',
                        placeItems: 'center',
                        alignItems: 'center',
                        marginTop: (question.onCorrectImages.length <= 3 && !question.onCorrectAudios?.length) || question.onCorrectText.length > 400 ? '20rem' : '',

                    }}>
                    {question.onCorrectImages.map((img, i) => {

                        return (
                            <img
                                style={{
                                    width:
                                        str.includes("Qué tipo(s) es") && i === 0
                                            ? '200%'
                                            : str.includes("Qué tipo(s) es")
                                                ? '130%'

                                                : `${String((200 / question.onIncorrectImages.length) + 200) + '%'
                                                }`,
                                }}
                                className="image-on-correct" key={i} src={img} alt='' />
                        )
                    })}
                </div>
            )
        }
        const renderOnCorrectAudios = () => {
            if (question.onCorrectAudios.length === 0) {
                return <></>
            }
            return (
                <div className="on-correct-audios">
                    {question.onCorrectAudios.map((audio, i) => {
                        return <audio key={i} src={audio} controls />
                    })}
                </div>
            )
        }

        return (
            <div className="on-correct">
                {renderOnCorrectText()}
                <div className="on-correct-resources">
                    {renderOnCorrectImages()}
                    {renderOnCorrectAudios()}
                </div>
            </div>
        )
    }

    const renderOnIncorrect = () => {
        const renderOnIncorrectText = () => {
            return (
                <h2 className="on-incorrect-text">{question.onIncorrectText}</h2>
            )
        }
        const renderOnIncorrectImages = () => {
            if (question.onIncorrectImages.length === 0) {
                return <></>
            }
            const str = question.questionText;

            if (question.questionText.includes("A ver si te sabes la tabla de tipos")) {
                return (
                    <div className="on-correct-images"
                        style={{
                            padding: `${question.onIncorrectImages.length === 1 ? '0 rem' : '0rem'}`,
                            gridTemplateColumns: `repeat(${Math.min(question.onIncorrectImages.length, 15)}, 1fr)`
                            ,
                            placeItems: 'center',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: question.onIncorrectText.length > 400 ? '38rem' : '25rem',

                        }}>


                        {question.onIncorrectImages.map((img, i) => {

                            return (
                                <img
                                    style={{
                                        width: question.onIncorrectImages[i].includes("crossed-swords") ? '50%' : '100%',
                                    }}
                                    className="image-on-correct" key={i} src={img} alt='' />
                            )
                        })}
                    </div>
                )
            }
            return (
                <div className="on-correct-images"
                    style={{
                        padding: `${question.onIncorrectImages.length === 1 ? '0 rem' : '0rem'}`,
                        gridTemplateColumns: `repeat(${Math.min(question.onIncorrectImages.length, 11)}, 1fr)`
                        ,
                        gap: question.onIncorrectImages.length <= 3 ? '200px' : '',
                        placeItems: 'center',
                        alignItems: 'center',
                        marginTop: (question.onIncorrectImages.length <= 3 && !question.onIncorrectAudios?.length) || question.onIncorrectText.length > 400 ? '20rem' : '',

                    }}>
                    {question.onIncorrectImages.map((img, i) => {

                        return (
                            <img
                                style={{
                                    width:
                                        str.includes("Qué tipo(s) es") && i === 0
                                            ? '200%'
                                            : str.includes("Qué tipo(s) es")
                                                ? '130%'

                                                : `${String((200 / question.onIncorrectImages.length) + 200) + '%'
                                                }`,
                                }}
                                className="image-on-correct" key={i} src={img} alt='' />
                        )
                    })}
                </div>
            )
        }
        const renderOnIncorrectAudios = () => {
            if (question.onIncorrectAudios.length === 0) {
                return <></>
            }
            return (
                <div className="on-correct-audios">
                    {question.onIncorrectAudios.map((audio, i) => {
                        return <audio key={i} src={audio} controls />
                    })}
                </div>
            )
        }

        return (
            <div className="on-incorrect">
                {renderOnIncorrectText()}
                <div className="on-incorrect-resources">

                    {renderOnIncorrectImages()}
                    {renderOnIncorrectAudios()}
                </div>
            </div>
        )
    }




    return (
        <div className="question-container">

            <div className="answers-container">
                <NthQuestion question={question} isCorrect={isCorrect} quizzMode={quizzMode}/>
                <Answers question={question} isCorrect={isCorrect} selectedAnswers={selectedAnswers} setSelectedAnswers={setSelectedAnswers} handleSubmitAnswers={handleSubmitAnswers} />
                {isCorrect === null && renderSubmitAnswersButton()}
            </div>
            {isCorrect === true && renderOnCorrect()}
            {isCorrect === false && renderOnIncorrect()}
        </div>
    )
}
