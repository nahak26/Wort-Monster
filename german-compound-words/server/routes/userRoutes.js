import express from "express";
import { upsertUser } from "../db/upsert_user.js";
import { getUserById, getUsersByName } from "../db/get_user.js";

const router = express.Router();

router.get('/:uid', async (req, res) => {
  try {
    const user_id = req.params.uid;
    const data = await getUserById(user_id);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/name/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const data = await getUsersByName(name);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/sync', async (req, res) => {
  try {
    const { uid, name, email, picture } = req.body;
    //console.log(`uid: ${uid}, name: ${name}, email: ${email}, picture: ${picture}`)
    const data = await upsertUser(uid, name, email, picture);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
