import React, { useState } from "react";

import { Button, makeStyles, withStyles } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import Rating from "@material-ui/lab/Rating";

const questions = require("./questions.json");

const totalQuestions = questions.length;

const useAnswersStyles = makeStyles({
  answers: {
    display: "flex",
    justifyContent: "space-between",
    maginTop: "30px",
    marginBottom: "30px",
    flexWrap: "wrap",
    minWidth: "20%",
  },
  buttons: {
    marginBottom: "30px",
    "&:active": {
      background: "black",
      color: "white",
    },
  },
});
function Answers({ answers, checkAnswer }) {
  const classes = useAnswersStyles();
  return (
    <div className={classes.answers}>
      {answers &&
        answers.map((answer) => (
          <Button
            variant="contained"
            onClick={() => checkAnswer(answer)}
            key={answer}
            className={classes.buttons}
          >
            {decodeURIComponent(answer)}
          </Button>
        ))}
    </div>
  );
}

const useAppStyles = makeStyles({
  container: {
    border: "3px solid grey",
    padding: "8px",
    paddingTop: 0,
  },
  heading: {
    fontSize: "35px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  subHeading: {
    fontSize: "15px",
  },
  result: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "30px",
    marginBottom: "20px",
  },
  score: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px",
  },
});

const BorderLinearProgress = withStyles({
  root: {
    height: 15,
    backgroundColor: "#fff",
  },
  bar: {
    borderRadius: 20,
    backgroundColor: "#a9aaa9",
  },
})(LinearProgress);

function App() {
  const classes = useAppStyles();

  const [questionNumber, setQuestionNumber] = useState(1);
  const [question, setQuestion] = useState(questions[questionNumber].question);
  const [answers, setAnswers] = useState([
    ...questions[questionNumber].incorrect_answers,
    questions[questionNumber].correct_answer,
  ]);
  const [category, setCategory] = useState(questions[questionNumber].category);
  const [rating, setRating] = useState(questions[questionNumber].difficulty);
  const [showResult, setShowResult] = useState(false);

  const [correct, setCorrect] = useState(0  );
  const [isAnswered, setIsAswered] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const setQuestions = () => {
    if (questionNumber + 1 === totalQuestions) {
      setQuestionNumber(0);
    } else {
      setQuestion(questions[questionNumber].question);
      setAnswers([
        ...questions[questionNumber].incorrect_answers,
        questions[questionNumber].correct_answer,
      ]);
      setCategory(questions[questionNumber].category);
      setQuestionNumber(questionNumber + 1);
      setIsAswered(false);
      setRating(questions[questionNumber].difficulty);
      setShowResult(false);
      setShowButton(false);
    }
  };

  const checkAnswer = (answer) => {
    if (!isAnswered) {
      if (answers[3] === answer) {
        setCorrect(correct + 1);
        setIsAswered(true);
        setShowResult(true);
        setShowButton(true);
      } else {
        setIsAswered(false);
        setShowResult(true);
        setShowButton(true);
      }
    }
  };

  let questionRating;
  if (rating === "easy") {
    questionRating = <Rating name="pristine" value={1} max={3} />;
  } else if (rating === "hard") {
    questionRating = <Rating name="pristine" value={3} max={3} />;
  } else {
    questionRating = <Rating name="pristine" value={2} max={3} />;
  }

  const Show = (
    <div className={classes.result}> {isAnswered ? "Correct!" : "Sorry!"}</div>
  );

  const min = (correct / questions.length) * 100;
  let score;
  if (questionNumber === 0) {
    score = 0;
  } else {
    score = (correct / questionNumber) * 100;
  }
  const max =
    ((questions.length - (questionNumber - correct)) / questions.length) * 100;
  console.log(score, correct);
  return (
    <div className={classes.container}>
      <BorderLinearProgress
        variant="determinate"
        color="secondary"
        value={((questionNumber + 1) / questions.length) * 100}
      />
      <div className={classes.heading}>
        Question {questionNumber} of {totalQuestions}
      </div>
      <span className={classes.subHeading}>{decodeURIComponent(category)}</span>
      <div>{questionRating}</div>
      <h4>{decodeURIComponent(question)}</h4>
      <Answers answers={answers} checkAnswer={checkAnswer} />
      {showResult && Show}
      {showButton && (
        <div className={classes.result}>
          <Button variant="contained" onClick={setQuestions}>
            Next Question
          </Button>
        </div>
      )}
      <div className={classes.score}>
        <div>Score :{score}% </div>
        <div>Max Score : {max} % </div>
      </div>
      <BorderLinearProgress
        variant="determinate"
        color="secondary"
        value={30}
      />
    </div>
  );
}

export default App;
