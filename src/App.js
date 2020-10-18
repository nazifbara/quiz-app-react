import React, { useReducer } from 'react';
import axios from 'axios';
import './App.css';

const apiUrl = "https://opentdb.com/api.php?amount=8";

const quizReducer = (state, action) => {
  switch(action.type) {
    case "QUIZ_FINISHED":
      return {
        ...state,
        quizFinished: true,
      }
    case "NEXT_QUESTION":
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        currentAnswer: ""
      }
    case "SET_CURRENT_ANSWER":
      return {
        ...state,
        currentAnswer: action.payload.value,
        goodAnswersCount: action.payload.isCorrect ? state.goodAnswersCount + 1 : state.goodAnswersCount,
      }
    case "QUIZ_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
      }
    case "QUIZ_FETCH_SUCCESS": {
      const data = action.payload.map(quiz => {
        const correctAnswerIndex = Math.floor(Math.random() * Math.floor(quiz.incorrect_answers.length));
        const answers = [
          ...quiz.incorrect_answers.slice(0, correctAnswerIndex),
          quiz.correct_answer,
          ...quiz.incorrect_answers.slice(correctAnswerIndex)
        ];
        return {
          ...quiz,
          answers
        }
      });
      return {
        ...state,
        data,
        isLoading: false,
        quizStarted: true,
      }
    }
    case "QUIZ_FETCH_FAILURE":
      return {
        ...state,
        isError: true
      }
    default:
      return state
  }
}

function App() {
  const [quiz, dispatchQuiz] = useReducer(
    quizReducer,
    {
      data: [],
      isLoading: false,
      isError: false,
      quizStarted: false,
      quizFinished: false,
      currentQuestionIndex: 0,
      goodAnswersCount: 0,
      currentAnswer: "",
    }
  );

  const currentQuestion = quiz.data[quiz.currentQuestionIndex];
  const currentAnswer = quiz.currentAnswer;

  const handleNextQuestion = () => {
    if(!currentAnswer) return;
    if(quiz.currentQuestionIndex >= quiz.data.length - 1) {
      dispatchQuiz({type: "QUIZ_FINISHED"});
      return;
    }
    dispatchQuiz({type: "NEXT_QUESTION"})
  }

  const handleFetchQuiz = async () => {
    dispatchQuiz({type: "QUIZ_FETCH_INIT"});

    try {
      const  { data: { results } } = await axios.get(apiUrl);
      dispatchQuiz({type: "QUIZ_FETCH_SUCCESS", payload: results});
    } catch (e) {
      dispatchQuiz({type: "QUIZ_FETCH_FAILURE"});
    }
  }

  const handleAnswer = (e) => {
    if(quiz.currentAnswer) return;
    const value = e.target.value;
    const isCorrect = value === currentQuestion.correct_answer;
    console.log(isCorrect);
    dispatchQuiz({type: "SET_CURRENT_ANSWER", payload: {value, isCorrect}});
  }
  
  if(!quiz.quizStarted) {
    return (
      <button className="Button Start Absolute-center" onClick={handleFetchQuiz}>
        {quiz.isLoading ? "Loading...": "Start the quiz!"}   
      </button>
    );
  }

  if(quiz.quizFinished) {
    return (
      <p className="Result Absolute-center">
        Congratulation you've finish the quiz. You got {quiz.goodAnswersCount} correct answer(s) out of 8! <a href="/">Replay</a>
      </p>
    );
  }



  return (
    <div className="Quiz">
      <div className="Question">
        <span className="Badge">{quiz.currentQuestionIndex + 1}</span>
        <h3 dangerouslySetInnerHTML={{__html: currentQuestion.question}} />
      </div>
      <div className="Answers">
        {currentQuestion.answers.map(a => (
          <div key={a}>
            <input
              type="radio" 
              id={a} 
              name="answer" 
              value={a}
              onChange={handleAnswer} 
              checked={currentAnswer === a} 
            />
            <label
              className="Button Choice"
              dangerouslySetInnerHTML={{__html: a}}
              htmlFor={a}
              style={ currentAnswer ? {
                color: a === currentQuestion.correct_answer ? "green" : "red"
              } : {}}
            />
          </div>
        ))}
      </div>
      <button className="Button Next" onClick={handleNextQuestion}>Next</button>
    </div>
  )
}

export default App;
