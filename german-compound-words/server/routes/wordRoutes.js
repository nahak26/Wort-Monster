import express from 'express';
import { getWord, getAllCompoundWords, getCompoundWords, getSubWords } from '../db/get_word.js';
import { insertWord } from '../db/insert_word.js';
import { deleteWord } from '../db/delete_word.js';
import { updateWord } from '../db/update_word.js';
import { upsertWord } from '../db/upsert_word.js';

const router = express.Router();

const genderMapping = ["der", "die", "das"];

router.get('/getall', async (req, res) => {
  try {
    const data = await getAllCompoundWords();
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/get', async (req, res) => {
  try {
    const { ids } = req.query;
    const formattedIds = ids.split(",").map((id) => parseInt(id.trim(), 10));
    const data = await getCompoundWords(formattedIds);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/getsub', async (req, res) => {
  try {
    const { ids } = req.query;
    const formattedIds = ids.split(",").map((id) => parseInt(id.trim(), 10));
    const data = await getSubWords(formattedIds);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/get/:id', async (req, res) => {
  try {
    const wordId = req.params.id;
    const data = await getWord(wordId);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(['/upsert', '/create'], async (req, res) => {
  try {
    const { compoundWord, translation, subWords, userId } = req.body;

    //need update on pos setting
    const subWordString = subWords.map((subWord) => {
      const { word } = subWord;
      return word;
    })
    .join(', ');
    
    const lastSubWord = subWords[subWords.length - 1];
    const gender = (lastSubWord.gender == "der") ? 0 : 
                   (lastSubWord.gender == "die") ? 1 :
                   2;

    //get all subword ids
    const subWordIds = [];
    for (const subWord of subWords) {
      console.log("subword data: ", subWord);
      const { original, translation } = subWord;
      const data = await upsertWord(original, null, translation, gender, 0, null, userId);
      console.log("subword data: ", data);
      subWordIds.push(data.id);
    }
    //console.log("subword ids:", subWordIds);
    const validSubWordIds = subWordIds.filter((id) => id != null && id !== '');
    //console.log("validated: ", validSubWordIds);
    const formattedSubWordIds = `{${validSubWordIds.join(',')}}`;
    //console.log("formatted: ", formattedSubWordIds);

    //upsert the compound word
    const data = await upsertWord(compoundWord, subWordString, translation, gender, 0, formattedSubWordIds, userId); 
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const wordId = req.params.id;
    const data = await deleteWord(wordId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// !!!Not in use, mockup-ish need updates
router.put('/:id', async (req, res) => {
  try {
    const wordId = req.params.id;
    const wordData = req.body;
    const data = await updateWord(wordId, wordData.compoundWord, wordData.translation, 1, 0);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
