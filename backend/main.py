from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Mini AI Avatar Backend Running"
    }


@app.post("/chat")
def chat(data: dict):

    user_message = data["message"]

    return {
        "reply": f"AI says: You said '{user_message}'"
    }