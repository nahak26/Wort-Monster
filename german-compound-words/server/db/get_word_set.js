import { supabase } from "../lib/dbClient";

export async function getSet(set_id) {
  const { data, error } = await supabase
    .from("word_sets")
    .select("*")
    .eq("id", set_id);
  if (error) return null;
  return data;
}

export async function getUserSet(user_id) {
  const { data, error } = await supabase
    .from("word_sets")
    .select("*")
    .eq("user_id", user_id);
  if (error) return null;
  return data;
}
