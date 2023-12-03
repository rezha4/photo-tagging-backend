import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

app.use(cors());
app.use(bodyParser.json());

let correctAnswers = [];

let timeValue = 0;
let timerInterval;

function startTimer() {
  timerInterval = setInterval(() => {
    timeValue++;
  }, 1000);
}

function stopTimer() {
  timeValue = 0;
  clearInterval(timerInterval);
}

app.get("/time", (req, res) => {
  res.json({ time: timeValue });
});

app.post("/answers", (req, res) => {
  startTimer();
  const answer = req.body.answer;
  if (!correctAnswers.includes(answer)) {
    correctAnswers.push(answer);
    res.status(200).json({ message: `Correct, it is ${answer}` });
  }
  console.log(correctAnswers);
});

app.get("/game-completed", (req, res) => {
  if (correctAnswers.length >= 3) {
    res.status(200).json({ completed: true, message: "gamedone" });
    correctAnswers = [];
    stopTimer();
  } else {
    res.status(200).json({ completed: false, message: "not yeat" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}`);
});
