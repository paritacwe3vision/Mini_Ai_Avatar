from faster_whisper import WhisperModel
import tempfile
import os

# Load once when server starts
model = WhisperModel(
    "tiny",
    device="cpu",
    compute_type="int8"
)


def speech_to_text(audio_bytes):

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".webm"
    ) as temp_audio:

        temp_audio.write(audio_bytes)
        temp_path = temp_audio.name

    segments, info = model.transcribe(
        temp_path,
        beam_size=1
    )

    text = ""

    for segment in segments:
        text += segment.text + " "

    os.remove(temp_path)

    return text.strip()