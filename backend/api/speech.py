from fastapi import APIRouter, UploadFile, File
from services.speech_service import speech_to_text

router = APIRouter()


@router.post("/speech")
async def speech(file: UploadFile = File(...)):

    audio = await file.read()

    text = speech_to_text(audio)

    return {
        "text": text
    }