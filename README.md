<div align="center">
  <h1>OpsMind AI 🧠</h1>
  <p>An intelligent platform for advanced document management, processing, and AI-driven insights.</p>

  ![License](https://img.shields.io/badge/license-ISC-blue.svg)
  ![React](https://img.shields.io/badge/React-19-blue.svg)
  ![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
  ![Vite](https://img.shields.io/badge/Vite-8-purple.svg)
</div>

<br />

OpsMind AI features a robust architecture comprising a scalable backend, an interactive user-facing application, and a comprehensive administrative dashboard. It leverages Large Language Models (LLMs) to provide deep semantic understanding and conversational interfaces for your documents.

## 🚀 Features

- **AI-Powered Insights:** Integrates `@google/generative-ai` and Langchain for conversational QA and semantic analysis.
- **Robust Document Processing:** Ingestion and parsing for multiple document formats (PDFs, Word documents) using `pdf-parse` and `mammoth`.
- **Interactive User Interface:** Fluid, responsive, and animated user interface built with React, Vite, Framer Motion, and Tailwind CSS.
- **Admin Dashboard:** Comprehensive administration panel for data visualization (using `recharts`) and document oversight.
- **Secure Architecture:** JWT-based authentication and secure data persistence with MongoDB and Mongoose.

## 🏗️ Project Architecture

The repository is organized into a monorepo-style structure containing three main components:

- **`backend/`**: The Node.js/Express server that acts as the core API. It manages database interactions, handles document uploads/parsing, and orchestrates calls to Langchain & Google GenAI.
- **`frontend/`**: The primary React application. It serves as the end-user portal to chat with the AI and query indexed documents.
- **`admin-frontend/`**: A secondary React application designed for administrators to manage ingested documents, track usage statistics, and maintain platform health.

## 💻 Tech Stack

### Backend
- **Core:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **AI & NLP:** Langchain, Google Generative AI
- **Security:** JWT (JSON Web Tokens), bcryptjs
- **File Processing:** Multer, pdf-parse, mammoth

### Frontends (User & Admin)
- **Core:** React 19, Vite
- **Styling:** Tailwind CSS, PostCSS
- **Routing & Networking:** React Router DOM, Axios
- **UI Enhancements:** Framer Motion (animations), React Markdown (rendering AI output), Recharts (data visualization)

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB (Local instance or MongoDB Atlas)
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/opsmind-ai.git
   cd opsmind-ai
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   
   # You will need to create a .env file in the backend directory
   # Required variables typically include: 
   # PORT=5000
   # MONGO_URI=your_mongodb_connection_string
   # GEMINI_API_KEY=your_google_genai_api_key
   # JWT_SECRET=your_jwt_secret
   
   npm run dev
   ```

3. **User Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Admin Frontend Setup:**
   ```bash
   cd ../admin-frontend
   npm install
   npm run dev
   ```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📄 License

This project is licensed under the **ISC License**.

---
*Built with ❤️ for advanced AI-driven operations.*
