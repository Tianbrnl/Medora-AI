MedorAI — AI-Powered Medical Assistant

MedorAI is a doctor-focused medical AI web application designed to help healthcare professionals explore medical questions, review medication information, and analyze medical images through a conversational interface.
Built with React, Supabase, Node.js, and Google's Gemini API, MedorAI combines AI-powered responses with personalized medication records and chat history in a clean, intuitive workspace.

Disclaimer: MedorAI is intended as a medical information and reference tool for healthcare professionals. AI-generated content may be inaccurate or incomplete and must be independently verified. It is not a substitute for professional clinical judgment, established clinical guidelines, or emergency medical care.

✨ Features

AI Medical Chat — Ask medical questions and receive concise, clinically oriented responses.
Image Analysis — Upload supported images and ask the AI to interpret their visible contents.
Medication Management — Add, edit, search, filter, and delete medication records.
Medication Categories — Organize medications into custom categories.
Personalized Medication Context — Use saved medication information as additional context during AI conversations.
Conversation History — Save and revisit previous conversations.
Response Regeneration — Request another response to a previous question.
User Authentication — Secure account access powered by Supabase Auth.
User Profiles — Manage profile information and usernames.
AI Usage Limits — Server-side request limits help control AI usage.
Responsive Interface — A clean, chat-focused interface designed for convenient use across screen sizes.

🛠️ Tech Stack



React
Tailwind CSS
Node.js
Express.js
Supabase
Google Gemini API
Lucide React
Vercel


📁 Project Structure

The project structure may vary as the application evolves.

MedorAI/
├── api/                    # Vercel API functions, if configured
├── public/                 # Static assets
├── server/
│   ├── index.js            # Local Express API server
│   ├── gemini.js           # Gemini integration
│   └── .env                # Local server environment variables
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Application pages
│   ├── medications/        # Medication-related components
│   ├── context/            # Application state and chat context
│   ├── lib/                # Supabase client and utilities
│   └── ...
├── .gitignore
├── package.json
├── vite.config.js
└── README.md

🚀 Getting Started

Prerequisites

Before running MedorAI locally, install:

Node.js — use a version compatible with your project dependencies.

npm

A Supabase project.

A Google AI Studio API key.

1. Clone the repository

git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd MedorAI
Replace the repository URL and directory name with your actual GitHub repository details.

2. Install dependencies

npm install

3. Configure frontend environment variables

Create a .env.local file in the project root:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

Replace the placeholder values with your Supabase project credentials.

4. Configure backend environment variables

Create a .env file inside the server/ directory:

GEMINI_API_KEY=your_gemini_api_key
PORT=3001

SUPABASE_URL=your_supabase_project_url
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

AI_CHAT_LIMIT=10
AI_CHAT_WINDOW_HOURS=6

The AI usage settings above represent a limit of 10 requests per rolling six-hour window, if enabled in the backend implementation.

Security notes:

Never commit .env, .env.local, or other files containing secrets.
Never expose your Gemini API key or Supabase service-role key in frontend code.
Keep backend secrets on the server or in your deployment platform's environment-variable settings.

5. Start the frontend

npm run dev
Vite will display the local URL in your terminal, typically:
http://localhost:5173

6. Start the backend

Open a second terminal in the project root and run:
npm run server
The local API server should be available at:
http://localhost:3001

Make sure your package.json defines the server script. If the backend is configured differently, use the command specified in your project.

🗄️ Supabase Setup

MedorAI uses Supabase for user authentication and persistent application data.
Configure the database tables and Row Level Security (RLS) policies required by your application. Depending on your current implementation, these may include:
conversations — Saved chat conversations.
messages — Messages associated with conversations.
medication_categories — User-defined medication categories.
medications — Saved medication information.
ai_chat_usage — Records used to enforce AI request limits.

Ensure that access policies restrict private records to their authorized users. Verify that the backend checks authentication before allowing AI requests or reading user-specific data.

🔐 Security

MedorAI uses authentication and server-side API handling to help protect user data and control access.
Recommended production practices:
Enable and verify RLS for all tables containing private user data.
Validate Supabase access tokens on the backend.
Enforce AI request limits on the server, not only in the frontend.
Validate uploaded image types and payload sizes.
Keep API keys and privileged credentials out of Git and browser bundles.
Configure production environment variables separately from local development.
Avoid logging sensitive medical information or authentication tokens.
Test access controls with multiple user accounts before deployment.

🌐 Deployment

MedorAI is intended to be deployable on Vercel with Supabase and Gemini.

Before deploying:

Push the finalized code to GitHub.
Import the repository into Vercel.
Configure the frontend build settings for Vite.
Add the required environment variables in Vercel.
Ensure the backend is adapted to Vercel's supported API runtime.
Replace local-only API URLs such as http://localhost:3001/api/chat with a production-compatible API path.
Test login, chat requests, image analysis, medication access, conversation history, and rate limiting on the deployed site.

Note: A local Express server does not automatically become a Vercel serverless API. Confirm that the backend has been adapted for production before relying on the deployed application.

🩺 Medical Disclaimer

MedorAI provides AI-generated medical information for informational and reference purposes. It can produce incorrect, outdated, or incomplete responses. Users must verify relevant information against trusted medical references and current clinical guidelines.
Do not rely on MedorAI as the sole basis for diagnosis, treatment, prescribing, or other clinical decisions. Do not upload identifiable patient information unless the application has been appropriately assessed and configured to meet applicable privacy, security, and regulatory requirements.

🛣️ Future Improvements

Potential areas for future development include:
Improved AI response reliability and error handling.
More robust medication search and organization.
Enhanced accessibility and mobile usability.
Expanded automated tests for authentication and data access.
Production monitoring and API usage analytics.

👨‍💻 Author

Developer: Christian Bernil
