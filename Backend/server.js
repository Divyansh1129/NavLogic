import express from "express";
import cors from "cors";
import route from "./routes/route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/route", route);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});