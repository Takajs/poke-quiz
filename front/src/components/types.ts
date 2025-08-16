
type ANSWER = {
    isCorrect: boolean,
    answerText: string,
    answerImages: string[],
    answerAudios: string[]
}
type QUESTION = {
    questionText: string,
    questionImages: string[],
    questionAudios: string[],

    allowsMultipleAnswers: boolean,
    answers: ANSWER[],
    score: number,


    onCorrectText: string,
    onCorrectImages: string[],
    onCorrectAudios: string[],
    onIncorrectText: string,
    onIncorrectImages: string[],
    onIncorrectAudios: string[]
}

export type { ANSWER, QUESTION }
