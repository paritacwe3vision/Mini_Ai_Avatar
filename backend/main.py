from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import time

from api.speech import router as speech_router
from api.upload import router as upload_router

from services.memory_service import save_memory, search_memory
from services.document_service import search_documents
from services.llm_service import generate_response
from services.tts_service import text_to_speech
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

# ----------------------------------------------------  
# API Routers
# ----------------------------------------------------

app.include_router(speech_router)
app.include_router(upload_router)

# ----------------------------------------------------
# CORS
# ----------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------
# Request Model
# ----------------------------------------------------

class ChatRequest(BaseModel):
    message: str

# ----------------------------------------------------
# Home
# ----------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Mini AI Avatar Backend Running"
    }

# ----------------------------------------------------
# Chat API
# ----------------------------------------------------

@app.post("/chat")
def chat(request: ChatRequest):

    user_message = request.message

    # ----------------------------------------------------
    # Retrieve Context
    # ----------------------------------------------------

    memories = []
    document_results = []
    web_results = None

    if needs_web_search(user_message):

        web_results = search_web(user_message)

    else:

        memories = search_memory(user_message)
        document_results = search_documents(user_message)
        

    # ----------------------------------------------------
    # Generate AI Response
    # ----------------------------------------------------

    response = generate_response(
        user_message=user_message,
        memories=memories,
        document_results=document_results,
        web_results=web_results,
    )

    # ----------------------------------------------------
    # Generate Speech
    # ----------------------------------------------------

    reply = response["reply"]
    emotion = response["emotion"]

    audio_file = text_to_speech(reply)

    # ----------------------------------------------------
    # Save Conversation Memory
    # ----------------------------------------------------

    save_memory(
        user_message=user_message,
        assistant_response=reply,
    )

    # ----------------------------------------------------
    # Return Response
    # ----------------------------------------------------

    return {
        "reply": reply,
        "emotion": emotion,
        "memory": memories,
        "audio": f"/static/{audio_file}?v={int(time.time() * 1000)}",
    }