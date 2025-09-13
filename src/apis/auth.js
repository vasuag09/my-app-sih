// src/apis/auth.js
import { supabase } from "../store/supaBaseClient";
export async function signUp(form) {
  console.log("Form Data =>", form);
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name,
          phone: form.phone,
          education: form.education,
          workExperience: form.workExperience,
          skills: form.skills,
          linkedin: form.linkedin,
          github: form.github,
          twitter: form.twitter,
          country: form.country, // ✅ new field
          city: form.city,
        },
      },
    });
    if (authError) throw authError;

    const user = authData?.user;
    const session = authData?.session;

    if (!user) throw new Error("No user returned from Supabase Auth");

    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      name: form.name,
      phone: form.phone,
      education: form.education,
      work_experience: form.workExperience,
      skills: form.skills,
      social_links: {
        linkedin: form.linkedin,
        github: form.github,
        twitter: form.twitter,
      },
      email: form.email,
      country: form.country,
      city: form.city,
    });
    if (profileError) throw profileError;
    // ✅ Save user into Redux
    return { user, session };
  } catch (err) {
    console.error("Signup failed:", err);
    throw err;
  }
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}
