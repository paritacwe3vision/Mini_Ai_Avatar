from fastapi import APIRouter
from pydantic import BaseModel

from services.llm_service import generate_response
import services.document_service as document_service
from services.memory_service import search_memory, save_memory

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


DOCUMENT_KEYWORDS = [
    "pdf",
    "document",
    "file",
    "chapter",
    "unit",
    "notes",
    "topic",
    "this",
    "summary",
    "summarize",
    "summarise",
    "important",
    "question",
    "questions",
    "important question",
    "important questions",
    "imp question",
    "imp questions",
    "mcq",
    "mcqs",
    "key point",
    "key points",
    "from this",
    "from document",
    "from the document",
    "explain this",
]


def is_document_request(message: str) -> bool:
    message = message.lower().strip()

    if any(keyword in message for keyword in DOCUMENT_KEYWORDS):
        return True

    short_commands = [
        "summary",
        "summarize",
        "summarise",
        "important questions",
        "imp questions",
        "mcq",
        "mcqs",
        "notes",
        "key points",
        "important",
        "questions",
    ]

    if len(message.split()) <= 5:
        return any(command in message for command in short_commands)

    return False


@router.post("/chat")
def chat(request: ChatRequest):

    user_message = request.message.strip()

    print("\n==============================")
    print("USER MESSAGE:", user_message)
    print("==============================")

    print("1️⃣ Searching memory...")
    memories = search_memory(user_message)
    print("✅ Memory done")

    print("2️⃣ Searching documents...")
    document_results = document_service.search_documents(user_message)
    print("✅ Document search done")

    if (
        document_service.ACTIVE_DOCUMENT is None
        and is_document_request(user_message)
    ):
        return {
            "reply": (
                "I don't have a document open right now. "
                "Please upload a PDF, and I'll be happy to summarize it, "
                "answer questions, explain topics, generate MCQs, "
                "important questions, notes, or anything else you need."
            ),
            "emotion": "neutral",
        }

    print("3️⃣ Calling LLM...")

    result = generate_response(
        user_message=user_message,
        memories=memories,
        document_results=document_results,
    )

    print("✅ LLM returned")

    print("4️⃣ Saving memory...")
    save_memory(user_message, result["reply"])

    print("✅ Finished")

    return result