import Quiz from './components/Quiz'
import './App.css'
import React, { useState, useEffect } from 'react'
import { generateQuizz } from '../src/questions/questions'
import { QUESTION } from '../src/components/types'




function App() {

  const [quizzDifficulty, setQuizzDifficulty] = useState("")
  const [quizz, setQuizz] = useState({} as QUESTION[])
  const [quizzMode, setQuizzMode] = useState("nidoball")
  const handleQuizzDifficultyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const questions = await generateQuizz(e)
    setQuizz(questions)
    setQuizzDifficulty(e)
    setQuizzMode(e);

  }


  const renderDifficultySelector = () => {
    return (
      <div className="mode-selector-container">
        <h2>Elige el tipo de desafío</h2>

        <div className="background difficulty-selector">

          <button className="difficulty-button nestball" onClick={() => handleQuizzDifficultyChange("nidoball")}>Copa Nidoball</button>

          <button className="difficulty-button pokeball" onClick={() => handleQuizzDifficultyChange("pokeball")}>Copa Pokéball</button>
          <button className="difficulty-button lureball" onClick={() => handleQuizzDifficultyChange("lureball")}>Copa Lureball</button>

          <button className="difficulty-button parkball" onClick={() => handleQuizzDifficultyChange("parkball")}>Copa parkball</button>

          <button className="difficulty-button honorball" onClick={() => handleQuizzDifficultyChange("honorball")}>Copa Honorball</button>


        </div>
        <div className="background difficulty-selector">
          <button className="difficulty-button friendball" onClick={() => handleQuizzDifficultyChange("friendball")}>Copa Friendball</button>

          <button className="difficulty-button fastball" onClick={() => handleQuizzDifficultyChange("fastball")}>Copa Quickball</button>
          <button className="difficulty-button greatball" onClick={() => handleQuizzDifficultyChange("greatball")}>Copa Greatball</button>

          <button className="difficulty-button levelball" onClick={() => handleQuizzDifficultyChange("levelball")}>Copa Levelball</button>
          <button className="difficulty-button sanaball" onClick={() => handleQuizzDifficultyChange("sanaball")}>Copa Sanaball</button>

        </div>


        <div className="background difficulty-selector">
          <button className="difficulty-button safariball" onClick={() => handleQuizzDifficultyChange("safariball")}>Copa Safariball</button>

          <button className="difficulty-button repeatball" onClick={() => handleQuizzDifficultyChange("repeatball")}>Copa Repeatball</button>
          <button className="difficulty-button heavyball" onClick={() => handleQuizzDifficultyChange("heavyball")}>Copa Heavyball</button>

          <button className="difficulty-button ultraball" onClick={() => handleQuizzDifficultyChange("ultraball")}>Copa Ultraball</button>

          <button className="difficulty-button loveball" onClick={() => handleQuizzDifficultyChange("loveball")}>Copa Loveball</button>






        </div>

        <div className="background difficulty-selector">
          <button className="difficulty-button duskball" onClick={() => handleQuizzDifficultyChange("duskball")}>Copa duskball</button>
          <button className="difficulty-button preciousball" onClick={() => handleQuizzDifficultyChange("preciousball")}>Copa Preciousball</button>
          <button className="difficulty-button diveball" onClick={() => handleQuizzDifficultyChange("diveball")}>Copa Diveball</button>


          <button className="difficulty-button luxuryball" onClick={() => handleQuizzDifficultyChange("luxuryball")}>Copa Luxuryball</button>


          <button className="difficulty-button masterball" onClick={() => handleQuizzDifficultyChange("masterball")}>Copa Masterball</button>
        </div>
      </div>
    )
  }

  if (quizzDifficulty === "") {
    return renderDifficultySelector()
  }

  return (
    <div className="background">
      <Quiz
        questions={quizz}
        setQuestions={setQuizz}
        quizzMode={quizzMode}
      />
    </div>
  )
}

export default App
