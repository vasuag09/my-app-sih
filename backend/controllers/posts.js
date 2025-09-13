import { v4 as uuidv4 } from "uuid";

// Temporary in-memory posts store
let posts = [
  {
    id: uuidv4(),
    title: "Welcome Alumni 🎉",
    content: "This is the first post on the forum.",
    author: "Admin",
    category: "General",
    createdAt: new Date().toISOString(),
  },
];

// GET all posts
function getPosts(req, res) {
  res.json(posts);
}

// POST new post
function addPost(req, res) {
  const { title, content, author, category } = req.body;

  if (!title || !content || !author) {
    return res
      .status(400)
      .json({ message: "Title, content, and author are required" });
  }

  const newPost = {
    id: uuidv4(),
    title,
    content,
    author,
    category: category || "General",
    createdAt: new Date().toISOString(),
  };

  posts.unshift(newPost);
  res.status(201).json(newPost);
}

// ✅ Explicit export
export { getPosts, addPost };
