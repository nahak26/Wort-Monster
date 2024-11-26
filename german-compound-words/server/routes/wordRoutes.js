import express from 'express';
import { getWord, getCompoundWords } from '../db/get_word.js';
import { insertWord } from '../db/insert_word.js';
import { deleteWord } from '../db/delete_word.js';
import { updateWord } from '../db/update_word.js';
import { upsertWord } from '../db/upsert_word.js';

const router = express.Router();

const genderMapping = ["der", "die", "das"];

router.get('/getall', async (req, res) => {
  try {
    const data = await getCompoundWords();
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/get/:id', async (req, res) => {
  try {
    const { wordId } = req.params;
    const data = await getWord(wordId);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(['/upsert', '/create'], async (req, res) => {
  try {
    const { compoundWord, translation, subWords } = req.body;

    //need update on pos setting
    const subWordString = subWords.map((subWord) => {
      const { word, original, stays } = subWord;
      if (!stays) {
        if (original && word.startsWith(original)) {
          //Straße+n, subword Straßen, original Straße
          const addedSuffix = word.slice(original.length);
          return `${original}+${addedSuffix}`;
        } else if (original && original.startsWith(word)) {
          //Halte-n, subword Halte, original Halten
          const deletedSuffix = original.slice(word.length);
          return `${word}-${deletedSuffix}`;
        } else if (original) {
          //Einwohner ~ Einwohnen, subword Einwohner, original Einwohnen
          return `${word}~${original}`;
      }
      }
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
      //console.log("subword data: ", subWord);
      const { word, translation } = subWord;
      const data = await upsertWord(word, null, translation, gender, 0, null);
      //console.log("subword data: ", data);
      subWordIds.push(data.id);
    }
    //console.log("subword ids:", subWordIds);
    const validSubWordIds = subWordIds.filter((id) => id != null && id !== '');
    //console.log("validated: ", validSubWordIds);
    const formattedSubWordIds = `{${validSubWordIds.join(',')}}`;
    //console.log("formatted: ", formattedSubWordIds);

    //upsert the compound word
    const data = await upsertWord(compoundWord, subWordString, translation, gender, 0, formattedSubWordIds); 
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
//mockup-ish need updates
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
