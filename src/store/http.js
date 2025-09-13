import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient();
const url = "http://localhost:3000";
export async function signInUser(userData) {
  const signInUrl = url + "/api/auth/login";
  const response = await fetch(signInUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const resData = await response.json();
  const token = resData.token;
  localStorage.setItem("token", token);
  return resData;
}
export async function signUpUser(userData) {
  const signUpUrl = url + "/api/auth/signup";
  const response = await fetch(signUpUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const resData = await response.json();
  const token = resData.token;
  localStorage.setItem("token", token);
  return resData;
}
export async function fetchPosts() {
  const res = await fetch("http://localhost:3000/api/posts");
  if (!res.ok) throw new Error("Failed to fetch posts");
  const resData = await res.json()
  return resData
}
export async function addPost(newPost) {
  const res = await fetch("http://localhost:3000/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost),
  });
  if (!res.ok) throw new Error("Failed to add post");
  return res.json();
}
