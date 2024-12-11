import express from "express";
import cors from "cors";
import wordRoutes from "./routes/wordRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import wordSetRoutes from "./routes/wordSetRoutes.js";

const app = express();

app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from client
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
  credentials: true,
};

app.use(cors(corsOptions));
/*
app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log("Request Method:", req.method);
  console.log("Request URL:", req.originalUrl);
  console.log("Client IP:", ip);
  next();
});
*/
app.use("/api/users", userRoutes);
app.use("/api/words", wordRoutes);
app.use("/api/wordsets", wordSetRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Wort Monster Server side!");
});

export default app;
