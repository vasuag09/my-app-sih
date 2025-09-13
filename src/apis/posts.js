// src/apis/posts.js
import { supabase } from "../store/supaBaseClient";

export async function fetchPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      category,
      created_at,
      author_id,
      profiles ( name )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  console.log("Fetched posts:", data);
  return data;
}

export async function addPost({ title, content, category }) {
  // assume user is signed in; get user id
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("posts")
    .insert([{ title, content, category, author_id: user.id }])
    .select();

  if (error) throw error;
  return data[0];
}
