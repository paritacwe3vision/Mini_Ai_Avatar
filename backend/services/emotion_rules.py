"""
Emotion Rules Service

This module defines how the LLM should respond
based on the detected user emotion.
"""

EMOTION_RULES = {

    "happy": {
        "tone": "Friendly, cheerful and encouraging",

        "instructions": """
- Respond positively.
- Celebrate the user's success.
- Keep the conversation energetic.
- Encourage further discussion.
- Be warm and engaging.
"""
    },

    "sad": {
        "tone": "Calm, empathetic and supportive",

        "instructions": """
- Show empathy.
- Be patient.
- Use comforting language.
- Encourage without forcing positivity.
- Keep responses gentle.
"""
    },

    "angry": {
        "tone": "Professional and calm",

        "instructions": """
- Stay calm.
- Never argue.
- Acknowledge the user's frustration.
- Focus on solving the problem.
- Be respectful.
"""
    },

    "thinking": {
        "tone": "Analytical and thoughtful",

        "instructions": """
- Think carefully.
- Explain step by step.
- Give detailed reasoning.
- Provide examples whenever useful.
- Be accurate.
"""
    },

    "neutral": {
        "tone": "Professional and helpful",

        "instructions": """
- Answer naturally.
- Keep responses clear.
- Be concise.
- Stay professional.
"""
    }

}


def get_emotion_rules(emotion: str) -> dict:
    """
    Return LLM behaviour rules for the detected emotion.

    Returns:
    {
        "tone": "...",
        "instructions": "..."
    }
    """

    emotion = emotion.lower()

    return EMOTION_RULES.get(
        emotion,
        EMOTION_RULES["neutral"]
    )