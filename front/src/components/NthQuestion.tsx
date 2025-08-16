import { QUESTION } from './types'

export default function NthQuestion(
    { question, isCorrect, quizzMode }: { question: QUESTION, isCorrect: boolean | null, quizzMode: string }
) {

    const renderQuestion = () => {
        const renderQuestionText = () => {
            return (
                <h1>{question.questionText}</h1>
            )
        }
        const renderQuestionImages = () => {
            if (question.questionImages?.length === 0) {
                return <></>
            }

            if (question.questionText === '¿Cuál es este Pokémon?') {
                const random = Math.floor(Math.random() * 2)
                if ((random === 0 && quizzMode !== 'duskball') || quizzMode === 'nidoball') {
                    return (
                        <div className="question-images">
                            {question.questionImages.map((img, i) => {
                                return <img className="image-in-question-blur" key={i} src={img} alt='' />
                            })}
                        </div>
                    )
                }

                return (
                    <div className="question-images">
                        {question.questionImages.map((img, i) => {
                            return <img className="image-in-question-hidden" key={i} src={img} alt='' />
                        })}
                    </div>
                )
            }
            return (
                <div className="question-images">
                    {question.questionImages.map((img, i) => {
                        return <img className="image" key={i} src={img} alt='' />
                    })}
                </div>
            )
        }
        const renderQuestionAudios = () => {
            if (question.questionAudios.length === 0) {
                return <></>
            }
            return (
                <div className="question-audios">
                    {question.questionAudios.map((audio, i) => {
                        return <audio key={i} src={audio} controls />
                    })}
                </div>
            )
        }
        return (
            <div className="question">
                {renderQuestionText()}
                {renderQuestionImages()}
                {renderQuestionAudios()}
            </div>
        )
    }
    return (
        <>{isCorrect === null && renderQuestion()}</>
    )
}
