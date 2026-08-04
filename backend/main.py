from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time

from services.memory_service import save_memory, search_memory
from services.llm_service import generate_response
from services.tts_service import text_to_speech

from api.speech import router as speech_router
from fastapi.staticfiles import StaticFiles

from services.router_service import needs_web_search
from services.web_service import search_web


app = FastAPI(
    title="Mini AI Avatar Backend"
)

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static",
)


# -----------------------------
# Speech API
# -----------------------------

app.include_router(speech_router)

# -----------------------------
# CORS
# -----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
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
# Home
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

   # ----------------------------------------------------
    # 1. Decide where to get information
    # ----------------------------------------------------

    web_results = None

    if needs_web_search(user_message):

       # print("🌐 Using Tavily Search")

        memories = []

        web_results = search_web(user_message)

    else:

        #print("🧠 Using Chroma Memory")

        memories = search_memory(user_message)

    # ----------------------------------------------------
    # 2. Generate AI Response
    # ----------------------------------------------------

    response = generate_response(
        user_message=user_message,
        memories=memories,
        web_results=web_results
    )

    # ----------------------------------------------------
    # 3. Extract Reply & Emotion
    # ----------------------------------------------------

    reply = response["reply"]
    emotion = response["emotion"]
    audio_file = text_to_speech(reply)
    # ----------------------------------------------------
    # 4. Save Conversation
    # ----------------------------------------------------

    save_memory(
        user_message=user_message,
        assistant_response=reply
    )

    # ----------------------------------------------------
    # 5. Return Response
    # ----------------------------------------------------

    return {
        "reply": reply,
        "emotion": emotion,
        "memory": memories,
        "audio": f"/static/{audio_file}?v={int(time.time() * 1000)}"
    }