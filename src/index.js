import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser, { json } from "body-parser";
import mongoose from "mongoose";

const app = express();

let correctAnswers = [];
let startTime;
let duration;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO);
}

const leaderBoardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  time: { type: Number, default: duration },
  date: { type: Date, default: Date.now },
});

const LeaderBoard = mongoose.model("leaderBoard", leaderBoardSchema);

app.use(cors());
app.use(bodyParser.json());

app.get("/start-time", (req, res) => {
  if (startTime) {
    res.status(400).json({ message: "Time already started" });
  }
  startTime = Date.now();
  res.status(200).json({ message: "time started" });
});

app.get("/leaderboard", async (req, res) => {
  try {
    const leaderBoardData = await LeaderBoard.find({});
    res.status(200).json(leaderBoardData);
  } catch (err) {
    console.log(err);
  }
});

app.post("/form", async (req, res) => {
  const name = req.body.name;
  try {
    const newScore = new LeaderBoard({
      name: name,
      time: duration,
    });
    await newScore.save();
    res.status(200).json({ message: "Saved" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error" });
  }
});

app.post("/answers", (req, res) => {
  const answer = req.body.answer;
  if (!correctAnswers.includes(answer)) {
    correctAnswers.push(answer);
    res.status(200).json({ message: `Correct, it is ${answer}` });
  }
  console.log(correctAnswers);
});

app.get("/game-completed", (req, res) => {
  if (correctAnswers.length >= 3) {
    correctAnswers = [];
    const currentTime = new Date();
    duration = Math.floor((currentTime - startTime) / 1000);
    startTime = null;
    res.status(200).json({ completed: true, message: "gamedone" });
  } else {
    res.status(200).json({ completed: false, message: "not yeat" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}`);
});
