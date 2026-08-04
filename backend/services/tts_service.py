from piper import PiperVoice
import wave
import os


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
    print("✅ Piper TTS model loaded")

except Exception as e:
    print("❌ Failed to load Piper:", e)
    voice = None


# ==========================================
# Text → Speech
# ==========================================

def text_to_speech(text: str):

    if voice is None:
        raise Exception("Piper model not loaded")

    static_dir = os.path.join(
        BASE_DIR,
        "static"
    )

    os.makedirs(
        static_dir,
        exist_ok=True
    )

    # Always overwrite the same file
    output_path = os.path.join(
        static_dir,
        "speech.wav"
    )

    with wave.open(output_path, "wb") as wav_file:

        voice.synthesize_wav(
            text,
            wav_file
        )

    print("🔊 Speech generated")

    # Return only filename
    return "speech.wav"