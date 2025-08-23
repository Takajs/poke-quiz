import { useState, useEffect } from 'react'
import { QUESTION } from './types'
import Question from './Question'
import {
    addLureballLevelQuestionToQuizz,
    addHeavyballLevelQuestionToQuizz,
    addDuskballLevelQuestionToQuizz,
    addLoveballLevelQuestionToQuizz,
    addMasterballLevelQuestionToQuizz,
    addQuickballLevelQuestionToQuizz,
    addSanaballLevelQuestionToQuizz,
    addSafariballLevelQuestionToQuizz,
    addNidoballLevelQuestionToQuizz,
    addPokeballLevelQuestionToQuizz,
    addGreatballLevelQuestionToQuizz,
    addUltraballLevelQuestionToQuizz,
    addLevelballQuestionToQuizz,
    addFriendballLevelQuestionToQuizz,
    addParkballLevelQuestionToQuizz,
    addHonorballLevelQuestionToQuizz,
    addRepeatballLevelQuestionToQuizz

} from '../questions/questions'
import JSConfetti from 'js-confetti'
const jsConfetti = new JSConfetti()



export default function Quiz(
    {
        questions,
        setQuestions,
        quizzMode
    }:
        {
            questions: QUESTION[]
            setQuestions: React.Dispatch<React.SetStateAction<QUESTION[]>>
            quizzMode: string
        }) {

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [score, setScore] = useState(0)
    const [isCurrentQuestionCorrect, setIsCurrentQuestionCorrect] = useState<boolean | null>(null)
    const [hasFinished, setHasFinished] = useState(false)
    const [hasStarted, setHasStarted] = useState(true)

    const addQuestionToQuiz = async () => {
        if (hasStarted && currentQuestionIndex === questions.length - 1) {
            console.log("Adding question to quiz: " + quizzMode)
            if (quizzMode === "loveball") {
                const promise = addLoveballLevelQuestionToQuizz(questions).then(newQuestions => {
                    setQuestions(newQuestions)
                })
            }
            if (quizzMode === "honorball") {
                const promise = addHonorballLevelQuestionToQuizz(questions).then(newQuestions => {
                    setQuestions(newQuestions)
                })
            }
            if (quizzMode === "masterball") {
                const promise = addMasterballLevelQuestionToQuizz(questions).then(newQuestions => {
                    setQuestions(newQuestions)
                })
            }
            if (quizzMode === "nidoball") {
                const promise = addNidoballLevelQuestionToQuizz(questions).then(newQuestions => {
                    setQuestions(newQuestions)
                })
            }
            if (quizzMode === "duskball") {
                const promise = addDuskballLevelQuestionToQuizz(questions).then(newQuestions => {
                    setQuestions(newQuestions)
                })
            }
            else if (quizzMode === "pokeball") {
                const promise = addPokeballLevelQuestionToQuizz(questions).then(newQuestions => {
                    setQuestions(newQuestions)
                })
            }
            else if (quizzMode === "greatball") {
                const promise = addGreatballLevelQuestionToQuizz(questions).then(newQuestions => {
                    setQuestions(newQuestions)
                })
            }
            else if (quizzMode === "ultraball") {
                const promise = addUltraballLevelQuestionToQuizz(questions).then(newQuestions => {
                    setQuestions(newQuestions)
                })
            }
            else if (quizzMode === "safariball") {
                const promise = addSafariballLevelQuestionToQuizz(questions).then(newQuestions => {
                    setQuestions(newQuestions)
                })
            }
            else if (quizzMode === "sanaball") {
                const promise = addSanaballLevelQuestionToQuizz(questions).then(newQuestions => {
                    setQuestions(newQuestions)
                })
            }
            else if (quizzMode === "quickball") {
                const promise = addQuickballLevelQuestionToQuizz(questions).then(newQuestions => {
                    setQuestions(newQuestions)
                })
            }
            else if (quizzMode === "heavyball") {
                const promise = addHeavyballLevelQuestionToQuizz(questions).then(newQuestions => {
                    setQuestions(newQuestions)
                })
            }
            else if (quizzMode === "lureball") {
                const promise = addLureballLevelQuestionToQuizz(questions).then(newQuestions => {
                    setQuestions(newQuestions)
                })
            }
            else if (quizzMode === "friendball") {
                const promise = addFriendballLevelQuestionToQuizz(questions).then(newQuestions => {
                    setQuestions(newQuestions)
                })
            }
            else if (quizzMode === "levelball") {
                const promise = addLevelballQuestionToQuizz(questions).then(newQuestions => {
                    setQuestions(newQuestions)
                })
            }
            else if (quizzMode === "repeatball") {
                const promise = addRepeatballLevelQuestionToQuizz(questions).then(newQuestions => {
                    setQuestions(newQuestions)
                })
            }
            else if (quizzMode === "parkball") {
                const promise = addParkballLevelQuestionToQuizz(questions).then(newQuestions => {
                    setQuestions(newQuestions)
                })
            }

            else {
                console.error("Unknown quizz mode")
            }
        }
    }

    //if hasStarted or currentQuestionIndex changes, if currentQuestionIndex is equal to questions.length-1, add a question to the quiz
    useEffect(() => {
        addQuestionToQuiz()
    }, [hasStarted, currentQuestionIndex, questions, setQuestions, addNidoballLevelQuestionToQuizz])


    const getTotalScore = () => {
        let total = 0
        for (let i = 0; i < questions.length; i++) {
            total += questions[i].score
        }
        return total
    }


    const renderNthQuestion = (n: number) => {

        return (questions &&
            <div>
                <Question
                    question={questions[n]}
                    score={score}
                    setScore={setScore}
                    isCorrect={isCurrentQuestionCorrect}
                    setIsCorrect={setIsCurrentQuestionCorrect}
                    currentQuestionIndex={currentQuestionIndex}
                    setCurrentQuestionIndex={setCurrentQuestionIndex}
                    quizzMode={quizzMode}
                />
            </div>
        )
    }


    const handleStartQuiz = () => {
        setHasStarted(true)
    }

    const handleGoToNextQuestion = async () => {
        if (currentQuestionIndex === questions.length - 1) {
            //setHasFinished(true)

            //Wait until the next question is added to the quiz

            await addQuestionToQuiz()
            return
        }
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setIsCurrentQuestionCorrect(null)
    }
    const renderGoToNextQuestionButton = () => {
        if (isCurrentQuestionCorrect === null) {
            return <></>
        }
        return (

            <button className="continuar" onClick={handleGoToNextQuestion}>▽</button>

        )
    }

    const restartQuiz = () => {
        setCurrentQuestionIndex(0)
        setScore(0)
        setIsCurrentQuestionCorrect(null)
        setHasFinished(false)
    }



    const renderScore = () => {
        /*
        return (questions &&
            <div className="score-and-question-index">
                <div className="score">
                    <h3>Puntos</h3>
                    <h3>{score} / {getTotalScore()}</h3>
                </div>
                <div className="question-index">
                    <h3>Pregunta</h3>
                    <h3>{currentQuestionIndex + 1} / {questions.length}</h3>

                </div>
            </div>
        )
            */
    }

    if (questions && hasFinished) {
        //if score is more than half of the total possible score, confeti:
        if (score >= getTotalScore() / 2) {

            jsConfetti.addConfetti()
        }
        return (
            <div>
                <h2>¡Has terminado el Quiz! Has sacado un {score} de {getTotalScore()}</h2>
                <button className="continuar" onClick={restartQuiz}>A POR OTRO QUIZ</button>
            </div>
        )
    }
    return (
        hasStarted
            ? <div className="quiz">
                {renderNthQuestion(currentQuestionIndex)}
                {renderGoToNextQuestionButton()}
            </div>

            : <button className="continuar" onClick={handleStartQuiz}>COMENZAR</button>
    )
}
