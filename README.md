# 🎓 AlumConnect – Alumni Engagement & Networking Platform

An innovative alumni networking and event management platform built for the **Smart India Hackathon (SIH)**.  
Our solution bridges the gap between alumni, students, and institutions through **connections, mentorship, event calendars, maps, and chatrooms** – all in one place.  

---

## 🚀 Problem Statement
Colleges and universities struggle to maintain meaningful engagement with their alumni.  
Traditional platforms (emails, social media groups) are scattered, lack personalization, and do not effectively support **networking, mentorship, and event participation**.  

---

## 💡 Our Solution
**AlumConnect** provides a centralized digital platform where:
- Alumni can **connect** with peers and students.
- Institutions can **organize events, mentorships, and workshops**.
- Students can **network, learn, and grow** through alumni interactions.
- Admins can manage the ecosystem effectively.  

---

## ✨ Key Features

### 🔗 Connections
- Send/receive **connection requests** (like LinkedIn).
- Accept/reject requests and build your alumni network.
- View list of confirmed **connections**.

### 💬 Chatroom
- Real-time group chat for **discussions** using **Socket.IO**.
- Alumni-student **mentorship chatrooms**.
- Secure authentication via **Supabase/Auth + JWT**.

### 📅 Event Calendar
- Interactive calendar with alumni events & workshops.
- RSVP/Register for events.
- Sidebar with upcoming events & **badges** for Networking, Workshop, Mentorship.

### 🗺️ Alumni Map
- View alumni across the globe on an interactive map.
- Filter by **graduation year, batch, industry**.
- Helps students discover mentors in their field.

### 🎤 Forum
- Post questions, share resources, or job opportunities.
- Upvote/downvote and engage in discussions.

### 👤 User Profiles
- Alumni/Student profiles with **bio, graduation year, skills, current job**.
- Profile avatars with initials.
- Edit profile details from dashboard.

### 🔔 Notifications
- In-app notifications for new requests, events, and updates.

---

## 🛠️ Tech Stack

**Frontend**  
- React.js  
- Framer Motion (animations)  
- React-Calendar (events)  
- Custom CSS  

**Backend & Database**  
- Supabase (Postgres + Auth + Realtime)  
- Node.js/Express (REST APIs)  
- JWT Authentication  

**Other Tools**  
- Socket.IO (real-time chat)  
- n8n (automation workflows, chatbot)  
- GitHub (version control)  
- Vercel/Netlify (deployment)  

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/alumconnect.git
cd alumconnect
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory (never push this to GitHub).

```env
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
REACT_APP_GOOGLE_MAPS_KEY=your-maps-api-key
JWT_SECRET=your-secret-key
```

For reference, see `.env.example`.

### 4. Run Locally
```bash
npm start
```
The app will run on: **http://localhost:3000**

---

## 📂 Project Structure
```
AlumConnect/
│── public/
│── src/
│   ├── components/   # Reusable components (Navbar, Sidebar, Cards)
│   ├── pages/        # Feature pages (Dashboard, Forum, Events, Map)
│   ├── api/          # API calls to Supabase & Express
│   ├── styles/       # CSS files
│   ├── App.jsx
│   └── index.js
│── backend/          # Express server, Socket.IO, APIs
│── .env.example
│── README.md
```

---

## 🏆 Why This Project Can Win SIH
- **Scalable** – Can be adopted by any university/college.  
- **Impactful** – Strengthens alumni-student engagement.  
- **Innovative** – Combines networking, chat, map, and events in one ecosystem.  
- **Future Ready** – Can integrate AI-driven mentorship matching and job boards.  

---

## 📌 Future Enhancements
- AI-based alumni-student matching (skills, industry, goals).  
- Job & internship board powered by alumni.  
- Video conferencing integration for mentorship.  
- Blockchain-based alumni credential verification.  

---

## 📜 License
MIT License © 2025 AlumConnect Team
