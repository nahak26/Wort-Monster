import express from "express";
import { getSet, getUserSets } from "../db/get_word_set.js";

const router = express.Router();

router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const data = await getUserSets(userId);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
