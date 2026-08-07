# 🤖 Mini AI Avatar Assistant

A multimodal AI assistant that combines Large Language Models, Memory, Voice Interaction, Document Understanding, Web Search, and a 3D Animated Avatar.

The assistant can:
- Chat with users using AI
- Remember previous conversations
- Read and answer questions from PDF/DOCX files
- Speak responses using offline TTS
- Accept voice input
- Search the web for live information
- Control a 3D avatar with emotions and animations

---

# 🚀 Features

## 💬 AI Chat
- LLM powered conversations
- Custom AI personality
- Context-aware responses
- Markdown support
- Code syntax highlighting

## 🧠 AI Memory
The assistant remembers previous conversations using vector memory.

Technologies:
- ChromaDB
- Sentence Transformers

Flow:
```
Conversation
     |
     ↓
Embedding Generation
     |
     ↓
ChromaDB Storage
     |
     ↓
Memory Retrieval
```

## 📄 Document Question Answering (RAG)

Supported files:
- PDF
- DOCX

Pipeline:
```
Upload File
     |
     ↓
Extract Text
     |
     ↓
Split Into Chunks
     |
     ↓
Generate Embeddings
     |
     ↓
Store In ChromaDB
     |
     ↓
Answer Questions
```

Used:
- PyPDF
- python-docx
- LangChain Text Splitter
- ChromaDB

## 🌐 Web Search

The assistant can fetch live information.

Examples:
- Weather
- News
- Sports
- Current events

Flow:
```
User Question
      |
      ↓
Router Service
      |
      ↓
Need Web Search?
      |
      ↓
Search Web
      |
      ↓
Generate Answer
```

## 🗣️ Voice Assistant

### Text To Speech

Used:
- Piper TTS

Features:
- Offline
- Free
- Fast
- No API cost

Flow:
```
AI Response
     |
     ↓
Piper TTS
     |
     ↓
speech.wav
     |
     ↓
Audio Playback
```

## 🧍 3D AI Avatar

Built using:
- Three.js
- React Three Fiber
- Drei

Avatar animations:
- Idle
- Thinking
- Happy
- Sad

Emotion flow:
```
User Input
     |
     ↓
Emotion Detection
     |
     ↓
Avatar Animation
```

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | UI |
| Vite | Development Server |
| Three.js | 3D Rendering |
| React Three Fiber | React 3D Integration |
| Drei | Three.js Helpers |
| Axios | API Requests |
| React Markdown | Markdown Rendering |
| Prism | Code Highlighting |

## Backend

| Technology | Purpose |
|---|---|
| FastAPI | Backend API |
| Uvicorn | Server |
| Python | Backend Logic |
| OpenRouter | LLM API |
| ChromaDB | Vector Database |
| Sentence Transformers | Embeddings |
| Piper TTS | Speech Generation |
| PyPDF | PDF Processing |
| python-docx | DOCX Processing |

---

# 📂 Project Structure

```
Mini_AI_Avatar/

│
├── backend/
│
│── main.py
│
├── api/
│   ├── chat.py
│   ├── speech.py
│   └── upload.py
│
├── services/
│   ├── llm_service.py
│   ├── memory_service.py
│   ├── document_service.py
│   ├── emotion_service.py
│   ├── router_service.py
│   ├── web_service.py
│   └── tts_service.py
│
├── database/
│   └── chroma_db/
│
├── uploads/
│   └── documents/
│
└── static/
    └── speech.wav
│
└── frontend/
    ├── src/
    ├── components/
    ├── avatar/
    └── ChatPanel.jsx
```

---

# ⚙️ Installation Guide

## Requirements

Install:

- Python 3.11+
- Node.js 18+
- Git

---

# Backend Setup

Go to backend folder:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate environment:

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env` file inside backend:

```
OPENROUTER_API_KEY=your_openrouter_key
TAVILY_API_KEY=your_tavily_key
```

Start backend:

```bash
python -m uvicorn main:app --reload
```

Backend runs:

```
http://localhost:8000
```

---

# Frontend Setup

Open another terminal.

Go to frontend:

```bash
cd frontend
```

Install packages:

```bash
npm install
```

Start frontend:

```bash
npm run dev
```

Frontend runs:

```
http://localhost:5173
```

---

# 🔊 Piper TTS Setup

Download Piper TTS for your operating system.

Required files:

```
piper/
│
├── piper.exe
│
├── models/
│   └── en_US-lessac-medium.onnx
│
└── espeak-ng-data/
```

The backend uses Piper to generate:

```
backend/static/speech.wav
```

---

# 🧠 ChromaDB Storage

ChromaDB stores:

- Conversation memory
- Document embeddings

Location:

```
backend/database/chroma_db/
```

Embedding model:

```
all-MiniLM-L6-v2
```

---

# 🔄 Complete System Flow

```
User
 |
 ↓
React Frontend
 |
 ↓
FastAPI Backend
 |
 ├── OpenRouter LLM
 |
 ├── ChromaDB Memory
 |
 ├── Document RAG
 |
 ├── Web Search
 |
 └── Piper TTS
          |
          ↓
     Speech Output
          |
          ↓
      3D Avatar
```

---

# 📚 RAG Pipeline

Document Upload:

```
PDF/DOCX
   |
   ↓
Text Extraction
   |
   ↓
Chunk Creation
   |
   ↓
Embeddings
   |
   ↓
ChromaDB
```

Question:

```
User Question
       |
       ↓
Query Embedding
       |
       ↓
Similarity Search
       |
       ↓
Relevant Context
       |
       ↓
LLM Response
```
---

# ⚠️ Limitations

- Lip-sync requires avatar models with facial morph targets.
- Some scanned PDFs cannot extract text.
- Avatar animation depends on available model animations.
- Local TTS quality depends on selected Piper model.

---
