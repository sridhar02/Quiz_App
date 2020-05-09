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
    padding: "20px",
  },
  heading: {
    fontSize: "35px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  subHeading: {
    fontSize: "15px",
  },
});

const BorderLinearProgress = withStyles({
  root: {
    height: 15,
    backgroundColor: "#fff",
    border: "1px solid black",
  },
  bar: {
    borderRadius: 20,
    backgroundColor: "#a9aaa9",
  },
})(LinearProgress);

function App() {
  const classes = useAppStyles();

  const [questionNumber, setQuestionNumber] = useState(0);
  const [question, setQuestion] = useState(questions[questionNumber].question);
  const [answers, setAnswers] = useState([
    ...questions[questionNumber].incorrect_answers,
    questions[questionNumber].correct_answer,
  ]);
  const [category, setCategory] = useState(questions[questionNumber].category);
  const [rating, setRating] = useState(questions[questionNumber].difficulty);

  const [correct, setCorrect] = useState(0);
  const [isAnswered, setIsAswered] = useState(false);

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
    }
  };

  const checkAnswer = (answer) => {
    if (!isAnswered) {
      if (answers[3] === answer) {
        setIsAswered(true);
        setCorrect(correct + 1);
      } else {
        setIsAswered(false);
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

  return (
    <div className={classes.container}>
      <BorderLinearProgress
        variant="determinate"
        color="secondary"
        value={((questionNumber + 1) / questions.length) * 100}
      />
      <div className={classes.heading}>
        Question {questionNumber + 1} of {totalQuestions}
      </div>
      <span className={classes.subHeading}>{decodeURIComponent(category)}</span>
      <div>{questionRating}</div>
      <h4>{decodeURIComponent(question)}</h4>
      <Answers answers={answers} checkAnswer={checkAnswer} />
      <Button variant="contained" onClick={setQuestions}>
        Next Question
      </Button>
      {isAnswered && <div> Correct </div>}
      <div>
        <div>Lowest score :{(correct / questions.length) * 100} %</div>
        <div>Score :{(correct / questionNumber) * 100}% </div>
        <div>
          Max Score :{" "}
          {((questions.length - (questionNumber - correct)) /
            questions.length) *
            100}
        </div>
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
