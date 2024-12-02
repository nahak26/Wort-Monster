import { supabase } from "../lib/dbClient.js";

export async function getUser(uid) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("firebase_uid", uid)
      .single();
  
    if (error) return null;
    return data;
  }
