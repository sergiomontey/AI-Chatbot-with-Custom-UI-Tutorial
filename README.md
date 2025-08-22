# AI-Chatbot-with-Custom-UI-Tutorial

# Simple Chatbot with React and Python

This is a simple, beginner-friendly chatbot application built with a React frontend (using TypeScript) and a Python backend (using Flask). The chatbot's intelligence is powered by the Google Gemini API.

## Features

- **Frontend:** A modern, single-page application built with React and TypeScript.  
- **Backend:** A lightweight API server built with Python and Flask.  
- **AI Integration:** Uses the Gemini API to generate intelligent responses.  
- **Custom Styling:** Clean and simple UI designed with basic CSS.  
- **Virtual Environment:** Backend dependencies are managed in a Python virtual environment for a clean setup.  

---

## Getting Started

Follow these steps to set up and run the chatbot on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (with npm)  
- [Python 3](https://www.python.org/)  

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/sergiomontey/AI-Chatbot-with-Custom-UI-Tutorial.git
cd AI-Chatbot-with-Custom-UI-Tutorial
```

The project has two subdirectories:

```
frontend/   → React + TypeScript app
backend/    → Python Flask API
```

---

### Step 2: Frontend Setup

Navigate into the `frontend` directory and install dependencies:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

This will launch the frontend at:

👉 `http://localhost:5173`

---

### Step 3: Backend Setup

Navigate into the `backend` directory:

```bash
cd ../backend
```

#### Create and activate a Python virtual environment

On macOS / Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

On Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

#### Install dependencies

```bash
pip install Flask Flask-CORS google-generativeai
```

#### Configure Gemini API Key

Get a Gemini API key from [Google AI Studio](https://ai.google.dev/).  
Then open `app.py` and replace the placeholder:

```python
API_KEY = "YOUR_API_KEY_HERE"
```

(Recommended: use an environment variable instead of hardcoding.)

#### Run the backend server

```bash
python app.py
```

The backend will start at:

👉 `http://127.0.0.1:5001/chat`

---

### Step 4: Using the Chatbot

With **both servers running**:

1. Open `http://localhost:5173` in your browser.  
2. Type a message in the chatbox.  
3. The frontend sends your message to the Flask backend.  
4. The backend forwards it to Gemini and returns the response.  

---

## Troubleshooting

- **Port already in use** → If port `5000`/`5001` is busy, change the port in `app.py` and update the fetch URL in `App.tsx`.  
- **"Sorry, something went wrong"** → Usually means:
  - Backend isn’t running
  - Wrong Gemini API key
  - Mismatch between backend port and frontend fetch URL  

---

## Next Steps

Once you have the basics working, try adding:

- **Chat History** → Pass full conversation context for smarter replies.  
- **Better UI** → Add avatars, typing indicators, or markdown rendering.  
- **Database** → Save chat logs or add user authentication.  

---

## Project Structure

```
AI-Chatbot-with-Custom-UI-Tutorial/
│
├── backend/
│   ├── app.py          # Flask backend
│   └── venv/           # Python virtual environment
│
├── frontend/
│   ├── index.html      # Custom HTML with Tailwind
│   ├── src/
│   │   └── App.tsx     # React + TS chat UI
│   └── package.json
│
└── README.md
```

---

🚀 Happy Building!  
