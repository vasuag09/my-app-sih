import React, { use, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import "./ForumPage.css";
import { queryClient } from "../store/http";
import { fetchPosts } from "../apis/posts";
import { addPost } from "../apis/posts";
import { fetchGroups } from "../apis/groups";
import { useSelector } from "react-redux";
// APIs
// async function fetchGroups() {
//   const res = await fetch("http://localhost:3000/api/groups");
//   if (!res.ok) throw new Error("Failed to fetch groups");
//   return res.json();
// }

export default function ForumPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState("groups"); // 'groups' | 'recent' | 'mine'
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [newPost, setNewPost] = useState("");
  const [showForm, setShowForm] = useState(false);
  const user = useSelector(state=>state.user.user.user_metadata)
  const id = useSelector(state=>state.user.user.id)
  // Queries
  const {
    data: posts = [],
    isLoading: postsLoading,
    isError: postsError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
  const { data: groups = [], isLoading: groupsLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  });

  // Mutation with invalidation
  const { mutate, isPending } = useMutation({
    mutationFn: addPost,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["posts"] });
      setNewPost("");
      setShowForm(false); // close after posting
    },
  });

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts
      .filter((p) => p.content.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [posts, search]);

  const myPosts = useMemo(
    () => filteredPosts.filter((p) => p.author_id == id),
    [filteredPosts]
  );

  // Filtered groups
  const filteredGroups = useMemo(() => {
    const s = search.toLowerCase();
    return groups.filter((g) => {
      const matchesText = [g.title, g.subtitle, ...(g.tags || [])]
        .join(" ")
        .toLowerCase()
        .includes(s);
      const matchesCat = category === "All" || g.category === category;
      return matchesText && matchesCat;
    });
  }, [groups, search, category]);

  // Handle submit
  function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target)
    const newPost = Object.fromEntries(data.entries())
    console.log(newPost)
    mutate(newPost);
  }

  return (
    <div className="forum-page">
      {/* Header */}
      <div className="forum-header">
        <div>
          <h1>Discussion Forums</h1>
          <p>Connect and share knowledge with the alumni community</p>
        </div>
        <motion.button
          className="btn-primary"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Close" : "+ New Post"}
        </motion.button>
      </div>

      {/* New Post Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            className="forum-new-post"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="text"
              className="author-input"
              name="title"
              placeholder="Post Title"
            />

            <input
              type="text"
              value={user.name}
              readOnly
              className="author-input"
              name="author"
            />
            <textarea
              rows="4"
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              name="content"
            />
            <select className="group-select">
              <option>General</option>
              <option>Business</option>
              <option>Technology</option>
              <option>Career</option>
              <option>Mentorship</option>
            </select>
            <motion.button
              type="submit"
              className="btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={isPending}
            >
              {isPending ? "Posting..." : "Post"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="forum-stats">
        {[
          { label: "Active Groups", value: groups?.length || 0 },
          { label: "Total Posts", value: posts?.length || 0 },
          { label: "Total Members", value: 677 }, // replace with real
          { label: "My Posts", value: myPosts?.length || 0 },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="stat-card"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3>{s.label}</h3>
            <p>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="forum-tabs">
        {["groups", "recent", "mine"].map((key) => (
          <button
            key={key}
            className={`tab-btn ${tab === key ? "active" : ""}`}
            onClick={() => setTab(key)}
          >
            {key === "groups" && (
              <>
                Groups <span>{groups?.length || 0}</span>
              </>
            )}
            {key === "recent" && (
              <>
                Recent Posts <span>{posts?.length || 0}</span>
              </>
            )}
            {key === "mine" && (
              <>
                My Posts <span>{myPosts?.length || 0}</span>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="forum-filters">
        <input
          type="text"
          placeholder={
            tab === "groups" ? "Search groups..." : "Search posts..."
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {tab === "groups" && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All</option>
            <option>Business</option>
            <option>Technology</option>
            <option>Career</option>
            <option>Mentorship</option>
          </select>
        )}
      </div>

      {/* Content */}
      {tab === "groups" && (
        <div className="group-sections">
          <div className="group-hero-grid">
            {[
              {
                title: "Entrepreneurship",
                color: "green",
                category: "Business",
              },
              { title: "Technology", color: "blue", category: "Technology" },
              { title: "Career", color: "orange", category: "Career" },
              { title: "Mentorship", color: "purple", category: "Mentorship" },
            ].map((g) => (
              <motion.div
                key={g.title}
                className={`group-hero ${g.color}`}
                whileHover={{ y: -4, scale: 1.01 }}
              >
                <h2>{g.title}</h2>
              </motion.div>
            ))}
          </div>

          <div className="group-grid">
            {(groupsLoading
              ? Array.from({ length: 6 }).map((_, i) => ({
                  skeleton: true,
                  id: i,
                }))
              : filteredGroups
            ).map((g) =>
              g.skeleton ? (
                <div key={g.id} className="group-card skeleton" />
              ) : (
                <motion.div
                  key={g.id}
                  className="group-card"
                  whileHover={{ y: -3 }}
                >
                  <div className="group-card-header">
                    <h3>{g.title}</h3>
                    <span className="badge">{g.category}</span>
                  </div>
                  <p className="muted">{g.subtitle}</p>
                  <div className="group-meta">
                    <span>👥 {g.members} members</span>
                    <span>💬 {g.posts} posts</span>
                  </div>
                  <div className="tags">
                    {(g.tags || []).map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                  <button className="btn-secondary">Join Group</button>
                </motion.div>
              )
            )}
          </div>
        </div>
      )}

      {tab === "recent" && (
        <div className="posts-section">
          {postsLoading && <p>Loading posts...</p>}
          {postsError && <p>Failed to fetch posts.</p>}
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              className="post-card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4>{post.title}</h4>
              <p>{post.content}</p>
              <p>{post.profiles?.name || "Anonymous"}</p>
              <small>{new Date(post.created_at).toLocaleString()}</small>
            </motion.div>
          ))}
        </div>
      )}

      {tab === "mine" && (
        <div className="posts-section">
          {myPosts.map((post) => (
            <motion.div
              key={post.id}
              className="post-card my-post"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4>{post.author}</h4>
              <p>{post.content}</p>
              <small>{new Date(post.created_at).toLocaleString()}</small>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
