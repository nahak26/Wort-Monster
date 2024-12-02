import express from "express";
import { getSet, getUserSets } from "../db/get_word_set.js";
import { insertWordSet } from "../db/insert_word_set.js"
import { updateWordSet } from "../db/update_word_set.js";

const router = express.Router();

router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const data = await getUserSets(userId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { name, id } = req.body;
    console.log("request:", req.body);
    const data = await insertWordSet(name, id);
    console.log("set data:", data);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, words } = req.body;
    const data = await updateWordSet(id, name, words);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
