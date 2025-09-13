import { v4 as uuidv4 } from "uuid";

// Temporary in-memory groups store
let groups = [
  {
    id: uuidv4(),
    name: "AI & Machine Learning",
    description: "A group for alumni working in AI/ML domain.",
    members: 120,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: "Entrepreneurship Club",
    description: "For alumni who are startup founders or interested in entrepreneurship.",
    members: 85,
    createdAt: new Date().toISOString(),
  },
];

// GET all groups
export function getGroups(req, res) {
  res.json(groups);
}

// POST new group (👉 only for admin later)
export function addGroup(req, res) {
  const { name, description, members } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "Name and description are required" });
  }

  const newGroup = {
    id: uuidv4(),
    name,
    description,
    members: members || 1,
    createdAt: new Date().toISOString(),
  };

  groups.push(newGroup);
  res.status(201).json(newGroup);
}
