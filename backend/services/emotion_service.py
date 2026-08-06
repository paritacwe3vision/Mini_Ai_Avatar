from transformers import pipeline
import re

# ------------------------------------------------------------
# Load Emotion Detection Model (Loads only once)
# ------------------------------------------------------------

emotion_classifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=1,
)

# ------------------------------------------------------------
# Model Label Mapping
# ------------------------------------------------------------

EMOTION_MAP = {
    "joy": "happy",
    "love": "happy",

    "anger": "angry",
    "disgust": "angry",

    "sadness": "sad",

    "fear": "thinking",
    "surprise": "thinking",

    "neutral": "neutral",
}

# ------------------------------------------------------------
# Thinking Keywords
# ------------------------------------------------------------

THINKING_PATTERNS = [
    r"\blet me think\b",
    r"\bthinking\b",
    r"\bhmm\b",
    r"\bone moment\b",
    r"\bwait\b",
    r"\blet me check\b",
    r"\blet me see\b",
    r"\bi'm thinking\b",
    r"\bgive me a moment\b",
]

# ------------------------------------------------------------
# Detect Emotion
# ------------------------------------------------------------

def detect_emotion(text: str):

    text = text.strip()

    if not text:
        return {
            "emotion": "neutral",
            "score": 1.0
        }

    lower_text = text.lower()

    # --------------------------------------------------------
    # Rule-Based Thinking Detection
    # --------------------------------------------------------

    for pattern in THINKING_PATTERNS:
        if re.search(pattern, lower_text):
            return {
                "emotion": "thinking",
                "score": 1.0
            }

    # --------------------------------------------------------
    # HuggingFace Emotion Detection
    # --------------------------------------------------------

    result = emotion_classifier(text)[0][0]

    label = result["label"].lower()
    score = round(result["score"], 4)

    emotion = EMOTION_MAP.get(label, "neutral")
    return {
        "emotion": emotion,
        "score": score
    }