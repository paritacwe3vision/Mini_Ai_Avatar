from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.memory_service import save_memory, search_memory
from services.llm_service import generate_response


app = FastAPI(
    title="Mini AI Avatar Backend"
)


# -----------------------------
# CORS Configuration
# -----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Request Model
# -----------------------------

class ChatRequest(BaseModel):
    message: str



# -----------------------------
# Home Route
# -----------------------------

@app.get("/")
def home():

    return {
        "message": "Mini AI Avatar Backend Running"
    }



# -----------------------------
# Chat API
# -----------------------------

@app.post("/chat")
def chat(request: ChatRequest):

    user_message = request.message


    # 1. Search previous memory from ChromaDB
    memories = search_memory(
        user_message
    )


    # 2. Send prompt + memory to LLM
    reply = generate_response(
        user_message,
        memories
    )


    # 3. Store conversation back into memory
    save_memory(
        user_message,
        reply
    )


    return {

        "reply": reply,

        "memory": memories

    }