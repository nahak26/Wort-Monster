import express from "express";
import { getAllSets, getSetById, getSetByName, getSetsByCreators, getUserSets, getSetsContainIds } from "../db/get_word_set.js";
import { insertWordSet } from "../db/insert_word_set.js"
import { updateWordSet, addViewerToSet } from "../db/update_word_set.js";
import { deleteWordSet } from "../db/delete_word_set.js";

const router = express.Router();

router.get("/getall", async (req, res) => {
  try {
    const data = await getAllSets(userId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/get", async (req, res) => {
  try {
    const { id, name } = req.query;
    if (id) {
      const data = await getSetById(id);
      res.status(200).json(data);
    } else if (name) {
      const data = await getSetByName(name);
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/creator", async (req, res) => {
  try {
    const { ids } = req.query;
    const formattedIds = ids.split(",").map((id) => parseInt(id.trim(), 10));
    const data = await getSetsByCreators(formattedIds);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await getUserSets(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/get/wordIds', async (req, res) => {
  try {
    const { ids } = req.query;
    const formattedIds = ids.split(",").map((id) => parseInt(id.trim(), 10));
    const data = await getSetsContainIds(formattedIds);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { name, id } = req.body;
    const data = await insertWordSet(name, id);
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

router.post("/addviewer", async (req, res) => {
  try {
    const { userId, setId } = req.query;
    const data = await addViewerToSet(setId, userId);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = await deleteWordSet(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
