import { supabase } from "../lib/dbClient.js";

export async function upsertUser(uid, name, email, picture) {
    const { data, error } = await supabase
        .from("users")
        .upsert(
            {
                uid,        // Firebase UID
                name,
                email,
                picture,
            },
            { onConflict: "email" }
        )
        .select()
        .single();

    if (error) {
        console.error("Error upserting user:", error);
        return null;
    }
    return data;
}
