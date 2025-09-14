import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import connectionRoutes from "./routes/connections.js";
import jobRoutes from "./routes/jobs.js"
dotenv.config();


// Import routes
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import groupRoutes from "./routes/groups.js";

const app = express();
const PORT = process.env.PORT || 3000;

// --- Supabase client (service role for inserts) ---
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Create HTTP server (needed for socket.io)
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // React app
    methods: ["GET", "POST"],
  },
});

// Track connected users
let users = {};

io.on("connection", (socket) => {
  console.log("✅ New connection:", socket.id);

  // When user joins a channel
  socket.on("join", ({ username, userId, channel }) => {
    users[socket.id] = { username, userId, channel };
    socket.join(channel); // <-- join socket room
    io.to(channel).emit("userList", getUsersInChannel(channel));
    io.to(channel).emit("chatMessage", {
      user: "System",
      text: `${username} joined #${channel}`,
      channel,
      created_at: new Date(),
    });
  });

  // When user sends a message
  socket.on("chatMessage", async (msg) => {
    const user = users[socket.id];
    if (!user) return;

    const payload = {
      user: user.username,
      text: msg.text,
      channel: msg.channel,
      created_at: new Date(),
    };

    // Broadcast only to the channel
    io.to(msg.channel).emit("chatMessage", payload);

    // Save to DB
    try {
      const { error } = await supabase.from("messages").insert([
        {
          user_id: user.userId,
          username: user.username,
          content: msg.text,
          channel: msg.channel,
        },
      ]);
      if (error) throw error;
    } catch (err) {
      console.error("❌ Failed to save message:", err.message);
    }
  });

  // When user disconnects
  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (!user) return;

    const channel = user.channel;
    delete users[socket.id];

    io.to(channel).emit("userList", getUsersInChannel(channel));
    io.to(channel).emit("chatMessage", {
      user: "System",
      text: `${user.username} left #${channel}`,
      channel,
      created_at: new Date(),
    });
    console.log("❌ Disconnected:", socket.id);
  });
});

// Helper: Get users in a channel
function getUsersInChannel(channel) {
  return Object.values(users)
    .filter((u) => u.channel === channel)
    .map((u) => u.username);
}


// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // React app
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/jobs", jobRoutes);

// New endpoint: fetch last 50 messages
app.get("/api/messages", async (req, res) => {
  const channel = req.query.channel || "general";

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("channel", channel) // filter by channel
    .order("created_at", { ascending: true })
    .limit(50);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});


app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Run both API + WebSockets
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running with API + WebSocket on http://localhost:${PORT}`);
});
