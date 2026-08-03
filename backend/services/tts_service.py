import subprocess
import uuid
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

PIPER = BASE_DIR / "piper" / "piper.exe"
MODEL = BASE_DIR / "piper" / "models" / "en_US-lessac-medium.onnx"
ESPEAK_DATA = BASE_DIR / "piper" / "espeak-ng-data"

OUTPUT_DIR = BASE_DIR / "static" / "audio"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def text_to_speech(text: str):

    filename = f"{uuid.uuid4()}.wav"
    output = OUTPUT_DIR / filename

    command = [
        str(PIPER),
        "-m", str(MODEL),
        "-f", str(output),
        "--espeak_data", str(ESPEAK_DATA),
    ]

    result = subprocess.run(
        command,
        input=text,
        text=True,              # Send text directly instead of bytes
        capture_output=True,
        cwd=str(BASE_DIR / "piper")
    )

    if result.returncode != 0:
        print(result.stderr)
        raise RuntimeError("Piper TTS failed.")

    return filename