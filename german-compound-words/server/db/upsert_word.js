import { supabase } from "../lib/dbClient.js";

export async function upsertWord(word, sub_words, definition, gender, pos, sub_word_ids, owner) {
  const { data, error } = await supabase
    .from("dictionary")
    .upsert(
      {
        word,
        sub_words,
        definition,
        gender,
        pos,
        sub_word_ids,
        owner
      },
      { onConflict: "word" },
    )
    .select()
    .single();

  if (error) {
    console.error("Error upserting word:", error);
    return null;
  }
  return data;
}
