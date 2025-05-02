📚 E-Tutoring Website Project Documentation
Enhancing e-learning with real-time chat functionality!
🚀 Overview
This project is an e-tutoring website built using:
- Node.js 🟢 (Backend runtime)
- Express.js ⚡ (Backend framework)
- React.js ⚛️ (Frontend framework)
- Next.js 🚀 (Full-stack React framework)
- MongoDB 🗄️ (NoSQL database)
- Socket.IO 🔄 (Real-time messaging)


🔧 Prerequisites
Ensure you have these installed before proceeding:
- Node.js 🟢 → Download Node.js
- npm (Node Package Manager) 📦 → Comes with Node.js
- MongoDB 🗄️ → Install MongoDB


🛠️ Setup Instructions
📥 Clone the Repository
git clone https://github.com/yourusername/group.git


Navigate to the project folder:
cd group



🔹 Backend Setup
1️⃣ Navigate to backend directory:
cd backendoff


2️⃣ Install dependencies:
npm install


3️⃣ Set up environment variables in a .env file:
Server Configuration
PORT=your-port-here
NODE_ENV=production


MongoDB Configuration
MONGODB_URI=your-url-here
MONGODB_URI_TEST=your-url-here


JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret


Email Configuration (SMTP)
SMTP_HOST=your-smtp-host
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-pass
SMTP_FROM=your-smtp-from


Frontend URL
FRONTEND_URL=your-frontend-url


File Upload Configuration
MAX_FILE_SIZE=10485760 # 10MB
UPLOAD_PATH=uploads/


Redis Configuration (for caching and rate limiting)
REDIS_HOST=localhost
REDIS_PORT=your-redis-port
REDIS_PASSWORD=your-redis-password


Socket.IO Configuration
SOCKET_PORT=your-socket-port


Rate Limiting
RATE_LIMIT_WINDOW_MS=900000 # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100



🔹 Frontend Setup
1️⃣ Navigate to frontend directory:
cd ../frontend1


2️⃣ Install dependencies:
npm install



🚀 Running the Project
▶️ Start the Backend
Run this command in the backend directory:
npm nodemon app.js


✔️ The Express.js server will start on localhost:5000.
▶️ Start the Frontend
Run this command in the frontend directory:
npm run dev


✔️ The Next.js development server will start on localhost:3000.

🔄 Setting Up Socket.IO for Messaging
1️⃣ Install Socket.IO
Run the following command in the backend directory:
npm install socket.io


2️⃣ Implement Socket.IO in Backend
Modify your app.js to include Socket.IO:
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message); // Broadcast message
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(process.env.SOCKET_PORT || 4000, () => {
  console.log(`Socket.IO server running on port ${process.env.SOCKET_PORT || 4000}`);
});


3️⃣ Implement Socket.IO in Frontend
Modify your frontend chat component (Chat.js or Chat.tsx):
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    socket.emit("sendMessage", message);
    setMessage("");
  };

  return (
    <div>
      <h2>Live Chat 💬</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;



🛠 Build Instructions
🛠 Backend Build
npm run build


✔️ Compiles backend for production deployment.
🛠 Frontend Build
npm run build


✔️ Next.js generates optimized static files for deployment.

🔑 Additional Notes
✅ Ensure MongoDB is running locally or provide a remote connection.
✅ Verify environment variables for frontend, backend, and Socket.IO.
✅ Use GitHub Actions or CircleCI for CI/CD automation.
✅ Socket.IO server must be running separately from Express backend for chat functionality.
