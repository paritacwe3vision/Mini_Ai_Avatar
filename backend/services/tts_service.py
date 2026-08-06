from piper import PiperVoice
import wave
import os
import re
import unicodedata


# ==========================================
# Base Directory
# ==========================================

BASE_DIR = os.path.dirname(
    os.path.dirname(__file__)
)

# ==========================================
# Piper Voice Model
# ==========================================

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "piper",
    "en_US-lessac-medium.onnx"
)

# ==========================================
# Load Piper Once
# ==========================================

try:
    voice = PiperVoice.load(MODEL_PATH)
    #print("✅ Piper TTS model loaded")

except Exception as e:
    #print("❌ Failed to load Piper:", e)
    voice = None


# ==========================================
# Clean LLM Output for TTS
# ==========================================

def clean_text_for_tts(text: str) -> str:
    """
    Convert Markdown/LLM output into plain text for Piper.
    """

    if not text:
        return ""

    # Normalize unicode
    text = unicodedata.normalize("NFKC", text)

    # Remove invisible/control characters
    text = "".join(
        ch for ch in text
        if unicodedata.category(ch)[0] != "C"
    )

    # Replace headings with a pause
    text = re.sub(
        r"^\s*#{1,6}\s*(.+)$",
        r". \1. ",
        text,
        flags=re.MULTILINE,
    )

    # Remove bold
    text = re.sub(
        r"\*\*(.*?)\*\*",
        r"\1",
        text,
    )

    # Remove italics
    text = re.sub(
        r"\*(.*?)\*",
        r"\1",
        text,
    )

    # Remove underscores
    text = re.sub(
        r"__(.*?)__",
        r"\1",
        text,
    )

    text = re.sub(
        r"_(.*?)_",
        r"\1",
        text,
    )

    # Remove inline code
    text = re.sub(
        r"`(.*?)`",
        r"\1",
        text,
    )

    # Convert markdown links
    text = re.sub(
        r"\[(.*?)\]\(.*?\)",
        r"\1",
        text,
    )

    # Remove bullet points
    text = re.sub(
        r"^\s*[-*+]\s*",
        "",
        text,
        flags=re.MULTILINE,
    )

    # Remove blockquotes
    text = re.sub(
        r"^\>\s*",
        "",
        text,
        flags=re.MULTILINE,
    )

    # Convert newlines into pauses
    text = re.sub(
        r"\n+",
        ". ",
        text,
    )

    # Remove extra spaces
    text = re.sub(
        r"\s+",
        " ",
        text,
    )
    # Remove repeated punctuation
    text = re.sub(r"\.{2,}", ".", text)

    # Space after punctuation
    text = re.sub(r"([.:!?])([A-Za-z])", r"\1 \2", text)

    # Collapse whitespace
    text = re.sub(r"\s+", " ", text)

    return text.strip()


# ==========================================
# Text → Speech
# ==========================================

def text_to_speech(text: str):

    if voice is None:
        raise Exception("Piper model not loaded")

    # Clean text before sending to Piper
    clean_text = clean_text_for_tts(text)

    static_dir = os.path.join(
        BASE_DIR,
        "static"
    )

    os.makedirs(
        static_dir,
        exist_ok=True
    )

    output_path = os.path.join(
        static_dir,
        "speech.wav"
    )

    with wave.open(output_path, "wb") as wav_file:

        voice.synthesize_wav(
            clean_text,
            wav_file
        )

    print("🔊 Speech generated")

    return "speech.wav"