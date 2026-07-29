# 🤖 AI Avatar - Intelligent Virtual Assistant

An AI-powered virtual avatar capable of **listening, understanding, responding, remembering conversations, and communicating through voice**.

This project combines **Artificial Intelligence, Speech Recognition, Large Language Models, Vector Memory, Text-to-Speech, and 3D Avatar Technology** to create an interactive human-like AI assistant.

---

# ✨ Features

## 🧠 AI Conversation
- Natural language conversation using Large Language Models (LLM)
- Context-aware responses
- Intelligent response generation
- Conversation history support

## 🎤 Speech Recognition
- Real-time microphone input
- Converts human speech into text
- Powered by Faster Whisper

## 🔊 Text-to-Speech
- Converts AI responses into natural voice
- Voice generation using Piper TTS

## 🧩 Long-Term Memory
- Stores previous conversations
- Retrieves relevant memories
- Uses vector embeddings
- Powered by ChromaDB

## 👤 3D AI Avatar
- Interactive virtual character
- Real-time AI responses
- Avatar rendering using Three.js / Ready Player Me

---

# 🏗️ System Architecture

```
                     User
                      |
                      |
               🎤 Microphone
                      |
                      |
             Speech Recognition
              (Faster Whisper)
                      |
                      |
                  FastAPI
                  Backend
                      |
        --------------------------------
        |                              |
        |                              |
       LLM                         ChromaDB
  (AI Response)                  (Memory Storage)
        |
        |
   Generated Response
        |
        |
      Piper TTS
        |
        |
       🔊 Voice
        |
        |
    3D AI Avatar
```

---

# 🛠️ Technology Stack

## Frontend

- React + Vite
- JavaScript
- CSS
- Three.js
- Ready Player Me Avatar

## Backend

- Python
- FastAPI
- Uvicorn

## Artificial Intelligence

- Large Language Model (OpenAI / OpenRouter / Ollama)
- Faster Whisper
- Piper TTS
- Sentence Transformers

## Memory System

- ChromaDB
- Vector Embeddings
- Semantic Search

---

# 📂 Project Structure

```
AI-Avatar/

│
├── backend/
│
│   ├── api/
│   │   ├── chat.py
│   │   ├── speech.py
│   │   ├── avatar.py
│   │   └── health.py
│   │
│   ├── services/
│   │   ├── llm_service.py
│   │   ├── memory_service.py
│   │   ├── speech_service.py
│   │   └── tts_service.py
│   │
│   ├── database/
│   │   └── chroma_db.py
│   │
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
│
├── frontend/
│
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation Guide

## 1. Clone Repository

```bash
git clone <repository-url>

cd AI-Avatar
```

---

# 🔹 Backend Setup

Navigate to backend:

```bash
cd backend
```

Create Python virtual environment:

```bash
python -m venv venv
```

Activate virtual environment:

### Windows

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## Environment Configuration

Create a `.env` file inside backend:

```env
OPENAI_API_KEY=your_api_key

OPENROUTER_API_KEY=your_api_key

CHROMA_PATH=./chroma_db

WHISPER_MODEL=base
```

---

## Run Backend Server

```bash
uvicorn main:app --reload
```

Backend will run at:

```
http://localhost:8000
```

---

# 🔹 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start React application:

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

# 🔌 API Endpoints

## Health Check

```
GET /health
```

---

## Chat API

```
POST /chat
```

Example request:

```json
{
    "message": "Hello AI"
}
```

Response:

```json
{
    "response": "Hello! How can I help you?"
}
```

---

## Speech API

```
POST /speech
```

Function:

- Accepts audio input
- Converts speech into text
- Sends text to AI model

---

# 🧠 Memory Workflow

```
User Input

      ↓

Convert Text Into Embedding

      ↓

Store In ChromaDB

      ↓

Search Similar Memories

      ↓

Send Context To LLM

      ↓

Generate Better Response
```

---

# 🔐 Environment Variables

Required variables:

```env
OPENAI_API_KEY=

OPENROUTER_API_KEY=

CHROMA_PATH=./chroma_db

WHISPER_MODEL=base
```

---

# 🚀 Future Improvements

- Real-time voice conversation
- Lip synchronization
- Facial expressions
- Emotion detection
- Multi-language support
- User authentication
- Cloud deployment
- Mobile application support

---

# 👨‍💻 Contributors

AI Avatar Development Team

---

# 📄 License

This project is created for educational and research purposes.