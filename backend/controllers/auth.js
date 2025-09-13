import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Temporary in-memory users store
const users = []; // 👉 replace with MongoDB/Postgres later

const JWT_SECRET = "supersecretkey"; // 👉 move to env var in production

// Signup controller
export async function signup(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const existingUser = users.find((u) => u.email === email);
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = { id: Date.now(), name, email, password: hashedPassword };
  users.push(newUser);

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(201).json({ user: { id: newUser.id, name, email }, token });
}

// Login controller
export async function login(req, res) {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ user: { id: user.id, name: user.name, email }, token });
}
