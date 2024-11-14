import express from "express";
import cors from "cors";
import wordRoutes from "./routes/wordRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/words", wordRoutes);

export default app;
