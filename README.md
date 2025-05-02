📚 E-Tutoring Website Project Documentation
🚀 Overview
This project is an e-tutoring website built using:
- Node.js 🟢 (Backend runtime)
- Express.js ⚡ (Backend framework)
- React.js ⚛️ (Frontend framework)
- Next.js 🚀 (Full-stack React framework)
- MongoDB 🗄️ (NoSQL database)

🔧 Prerequisites
Ensure you have these installed before proceeding:
- Node.js 🟢 → Download Node.js
- npm (Node Package Manager) 📦 → Comes with Node.js
- MongoDB 🗄️ → Install MongoDB


🛠️ Setup Instructions
📥 Clone the Repository
Run the following command in your terminal:
git clone https://github.com/yourusername/group.git


Then navigate to the project folder:
cd group


🔹 Backend Setup
1️⃣ Navigate to backend directory:
cd backendoff


2️⃣ Install dependencies:
npm install


3️⃣ Set up environment variables in a .env file:
# Server Configuration
PORT=your-post-here
NODE_ENV=production

# MongoDB Configuration
MONGODB_URI=your-url-here
MONGODB_URI_TEST=your-url-here

# JWT Configuration
JWT_SECRET=place-your-jwt-screthere
JWT_REFRESH_SECRET=place-your-jwt-screthere

# Email Configuration (SMTP)
SMTP_HOST=place-your-smtp-host-here
SMTP_USER=place-your-smtp-user-here
SMTP_PASS=place-your-smtp-pass-here
SMTP_FROM=place-your-smtp-from-here

# Frontend URL
FRONTEND_URL=your-frontend-url-here

# File Upload Configuration
MAX_FILE_SIZE=10485760 # 10MB in bytes
UPLOAD_PATH=uploads/

# Redis Configuration (for caching and rate limiting)
REDIS_HOST=localhost
REDIS_PORT=your-redis-host-here
REDIS_PASSWORD=your-redis-password-here

# CORS Configuration
CORS_ORIGIN=your-url-here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000 # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Session Configuration
SESSION_SECRET=your-place-here
SESSION_COOKIE_NAME=your-place-here
SESSION_COOKIE_SECURE=false
SESSION_COOKIE_HTTPONLY=true



🔹 Frontend Setup
1️⃣ Navigate to frontend directory:
cd ../frontend1


2️⃣ Install dependencies:
npm install



🚀 Running the Project
▶️ Start the Backend
Run this command in the backend directory:
npm nodemon app.js


✔️ The Express.js server will start on localhost:.
▶️ Start the Frontend
Run this command in the frontend directory:
npm run dev


✔️ The Next.js development server will start on localhost:.

🏗️ Build Instructions
🛠 Backend Build
To prepare the backend for production, run:
npm run build


✔️ This will compile backend files for production.
🛠 Frontend Build
To optimize the frontend for production, run:
npm run build


✔️ Next.js will generate a static production build.

🔑 Additional Notes
✅ Ensure MongoDB is running locally or provide a remote connection string in the .env file.
✅ Configure environment variables for backend and frontend correctly.
✅ Use GitHub Actions or CircleCI for CI/CD automation.
