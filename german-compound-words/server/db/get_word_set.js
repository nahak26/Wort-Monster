import { supabase } from "../lib/dbClient.js";

export async function getAllSets() {
  const { data, error } = await supabase
    .from("word_sets")
    .select("*");
  if (error) return null;
  return data;
}

export async function getSetById(set_id) {
  const { data, error } = await supabase
    .from("word_sets")
    .select("*")
    .eq("id", set_id)
    .single();
  if (error) return null;
  return data;
}

export async function getSetByName(name) {
  const { data, error } = await supabase
    .from("word_sets")
    .select("*")
    .or(`name.ilike.%${name}%`);
  if (error) return null;
  return data;
}

export async function getSetsByCreators(user_ids) {
  const { data, error } = await supabase
    .from("word_sets")
    .select("*")
    .in("user_id", user_ids);
  if (error) return null;
  return data;
}

export async function getUserSets(user_id) {
  const { data, error } = await supabase
    .from("word_sets")
    .select("*")
    .or(`user_id.eq.${user_id},viewers.cs.{${user_id}}`);
  if (error) return null;
  return data;
}

export async function getSetsContainIds(word_ids) {
  const { data, error } = await supabase
    .from("word_sets")
    .select("*")
    .overlaps("words", word_ids);
  if (error) return null;
  return data;
}
