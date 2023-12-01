import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}`);
});
