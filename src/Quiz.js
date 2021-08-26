import React, { useReducer, useEffect } from 'react';

import client from './client';

function Quiz() {
  const [quiz, dispatchQuiz] = useReducer(quizReducer, INITIAL_STATE);

  const letters = ['A', 'B', 'C', 'D'];
  const currentQuestion = quiz.data[quiz.currentQuestionIndex];
  const answerSelected = quiz.answerSelected;

  useEffect(() => {
    fetchQuiz();
  }, []);

  const handleNextQuestion = () => {
    if (!answerSelected) return;
    if (quiz.currentQuestionIndex >= quiz.data.length - 1) {
      dispatchQuiz({ type: 'QUIZ_FINISHED' });
      return;
    }
    dispatchQuiz({ type: 'NEXT_QUESTION' });
  };

  const fetchQuiz = async () => {
    dispatchQuiz({ type: 'QUIZ_FETCH_INIT' });

    try {
      const results = await client.fetchQuiz();
      dispatchQuiz({ type: 'QUIZ_FETCH_SUCCESS', payload: results });
    } catch (e) {
      console.error(e);
      dispatchQuiz({ type: 'QUIZ_FETCH_FAILURE' });
    }
  };

  const handleAnswer = ({ index, value }) => {
    if (quiz.answerSelected) return;
    const isCorrect = value === currentQuestion.correct_answer;
    dispatchQuiz({
      type: 'SET_CURRENT_ANSWER',
      payload: { isCorrect, answerIndex: index },
    });
  };

  return (
    <>
      {quiz.isLoading && <span>Loading...</span>}

      {quiz.finished && (
        <p className="result">
          Congratulation you have completed the quiz. You got{' '}
          {quiz.goodAnswersCount} correct answer(s) out of {quiz.data.length}{' '}
          questions right. <a href="/quiz">Try another quiz!</a>
        </p>
      )}

      {quiz.started && !quiz.finished && (
        <>
          <div className="question">
            <span className="badge">
              {quiz.currentQuestionIndex + 1}/{quiz.data.length}
            </span>
            <span
              dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
            />
          </div>
          <div className="answers">
            {currentQuestion.answers.map((a, i) => (
              <div
                onClick={() => handleAnswer({ index: i, value: a })}
                className={`answers__item ${
                  answerSelected &&
                  i === quiz.answerIndex &&
                  (quiz.correct ? 'correct' : 'incorrect')
                }`}
                key={a}
              >
                <span className="answers__letter">{letters[i]}</span>
                <span dangerouslySetInnerHTML={{ __html: a }} />
              </div>
            ))}
          </div>
          {quiz.answerSelected && (
            <div className="text-align-c">
              <button className="btn" onClick={handleNextQuestion}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

const quizReducer = (state, action) => {
  switch (action.type) {
    case 'QUIZ_FINISHED':
      return {
        ...state,
        finished: true,
      };
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        answerSelected: false,
        correct: false,
      };
    case 'SET_CURRENT_ANSWER':
      const { answerIndex, isCorrect } = action.payload;
      return {
        ...state,
        answerSelected: true,
        answerIndex: answerIndex,
        correct: isCorrect,
        goodAnswersCount: isCorrect
          ? state.goodAnswersCount + 1
          : state.goodAnswersCount,
      };
    case 'QUIZ_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
      };
    case 'QUIZ_FETCH_SUCCESS': {
      const data = action.payload.map((quiz) => {
        const correctAnswerIndex = Math.floor(
          Math.random() * Math.floor(quiz.incorrect_answers.length)
        );
        const answers = [
          ...quiz.incorrect_answers.slice(0, correctAnswerIndex),
          quiz.correct_answer,
          ...quiz.incorrect_answers.slice(correctAnswerIndex),
        ];
        return {
          ...quiz,
          answers,
        };
      });
      return {
        ...state,
        data,
        isLoading: false,
        started: true,
      };
    }
    case 'QUIZ_FETCH_FAILURE':
      return {
        ...state,
        isError: true,
      };
    default:
      return state;
  }
};

const INITIAL_STATE = {
  data: [],
  isLoading: false,
  isError: false,
  finished: false,
  correct: false,
  answerSelected: false,
  currentQuestionIndex: 0,
  goodAnswersCount: 0,
};

export default Quiz;
