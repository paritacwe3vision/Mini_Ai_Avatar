"""
Prompt Builder

This module combines:
- User Input
- Conversation Memory
- Detected Emotion
- Emotion Rules

into one final prompt for the LLM.
"""


def build_prompt(
    user_input: str,
    memory: list,
    emotion: str,
    emotion_rules: dict,
):
    """
    Build the final LLM prompt.

    Parameters
    ----------
    user_input : str
        Current user message.

    memory : list
        Relevant memories retrieved from ChromaDB.

    emotion : str
        Detected emotion.

    emotion_rules : dict
        Rules returned by emotion_rules.py
    """

    # -----------------------------------------
    # Format Memory
    # -----------------------------------------

    if memory:
        memory_text = "\n".join(
            f"- {item}" for item in memory
        )
    else:
        memory_text = "No previous memory."

    # -----------------------------------------
    # Final Prompt
    # -----------------------------------------

    prompt = f"""
You are an intelligent AI Avatar assistant.

==================================================

CURRENT USER EMOTION

{emotion}

==================================================

RESPONSE TONE

{emotion_rules["tone"]}

==================================================

BEHAVIOUR RULES

{emotion_rules["instructions"]}

==================================================

RELEVANT CONVERSATION MEMORY

{memory_text}

==================================================

CURRENT USER MESSAGE

{user_input}

==================================================

TASK

Generate a helpful, natural and context-aware response.

Do NOT mention the user's detected emotion.

Use the conversation memory only when it is relevant.

If memory is not relevant,
focus on the current message.

Keep responses conversational.
"""

    return prompt.strip()