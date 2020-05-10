import React, { useState, useEffect } from "react";

import { Button, makeStyles, withStyles } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import Rating from "@material-ui/lab/Rating";

const questions = require("./questions.json");

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
    "&:hover": {
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
    border: "2px solid grey",
    padding: "8px",
    paddingTop: 0,
    // width: "50%",
    margin: "8px",
    minHeight: "85vh",
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
  pogress1: {
    backgroundColor: "#000000",
  },
  progress2: {
    backgroundColor: "#717171",
  },
  progress3: {
    backgroundColor: "#d2d2d2",
  },
  progress: {
    display: "flex",
    border: "1px solid black",
    borderRadius: "8px ",
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

  const [questionNumber, setQuestionNumber] = useState(0);
  const [question, setQuestion] = useState(questions[questionNumber].question);
  const [answers, setAnswers] = useState([
    ...questions[questionNumber].incorrect_answers,
    questions[questionNumber].correct_answer,
  ]);
  const [category, setCategory] = useState(questions[questionNumber].category);
  const [rating, setRating] = useState(questions[questionNumber].difficulty);
  const [type, setType] = useState(questions[questionNumber].type);
  const [showResult, setShowResult] = useState(false);

  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [isAnswered, setIsAswered] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const setQuestions = () => {
    if (questionNumber + 1 === questions.length) {
      setQuestionNumber(0);
    } else {
      let number = questionNumber + 1;
      setQuestionNumber(questionNumber + 1);
      setQuestion(questions[number].question);
      setAnswers([
        ...questions[number].incorrect_answers,
        questions[number].correct_answer,
      ]);
      setType(questions[number].type);
      setCategory(questions[number].category);
      setRating(questions[number].difficulty);
      setIsAswered(false);
      setShowResult(false);
      setShowButton(false);
    }
  };
  useEffect(() => {
    // setQuestions();
  }, []);

  const checkAnswer = (answer) => {
    if (!isAnswered) {
      if (type === "multiple") {
        if (answers[3] === answer) {
          setCorrect(correct + 1);
          setIsAswered(true);
          setShowResult(true);
          setShowButton(true);
        } else {
          setWrong(wrong + 1);
          setShowButton(true);
          setShowResult(true);
          setIsAswered(false);
        }
      } else if (type === "boolean") {
        if (answers[1] === answer) {
          setCorrect(correct + 1);
          setIsAswered(true);
          setShowResult(true);
          setShowButton(true);
        } else {
          setWrong(wrong + 1);
          setShowButton(true);
          setShowResult(true);
          setIsAswered(false);
        }
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
    score = (correct / (correct + wrong)) * 100;
  }
  const max =
    ((correct + (questions.length - (correct + wrong))) / questions.length) *
    100;

  console.log(min, score, max, correct, wrong);

  return (
    <div className={classes.container}>
      <BorderLinearProgress
        variant="determinate"
        color="secondary"
        value={((questionNumber + 1) / questions.length) * 100}
      />
      <div className={classes.heading}>
        Question {questionNumber + 1} of {questions.length}
      </div>
      <span className={classes.subHeading}>{decodeURIComponent(category)}</span>
      <div>{questionRating}</div>
      <h4>{decodeURIComponent(question)}</h4>
      <Answers answers={answers} checkAnswer={checkAnswer} />
      {showResult && Show}
      {showButton && (
        <div className={classes.result}>
          <Button variant="contained" onClick={() => setQuestions()}>
            Next Question
          </Button>
        </div>
      )}
      <div className={classes.score}>
        <div>Score :{score}% </div>
        <div>Max Score : {max} % </div>
      </div>
      <div className={classes.progress}>
        <div
          style={{ width: ` ${min}%`, backgroundColor: "#000", height: "20px" }}
        ></div>
        <div
          style={{
            width: `${score - min}%`,
            backgroundColor: "#717171",
            height: "20px",
          }}
        ></div>
        <div
          style={{
            width: `${max - score}%`,
            backgroundColor: "#d2d2d2",
            height: "20px",
          }}
        ></div>
      </div>
    </div>
  );
}

export default App;
