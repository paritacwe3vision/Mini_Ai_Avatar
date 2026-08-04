"""
Prompt Builder

Combines:
- User Input
- Conversation Memory
- Live Internet Information
- Detected Emotion
- Emotion Rules

into one prompt for the LLM.
"""


def build_prompt(
    user_input: str,
    memory: list,
    emotion: str,
    emotion_rules: dict,
    web_results: str = None,
):
    """
    Build the final LLM prompt.
    """

    # ==================================================
    # Memory
    # ==================================================

    if memory:
        memory_text = "\n".join(
            f"- {item}" for item in memory
        )
    else:
        memory_text = "No previous memory."

    # ==================================================
    # Live Internet Information
    # ==================================================

    if web_results:
        web_text = f"""
==================================================

LIVE INTERNET INFORMATION

The following information was retrieved from
a live web search.

Use this information as the primary source
if it answers the user's question.

{web_results}
"""
    else:
        web_text = ""

    # ==================================================
    # Final Prompt
    # ==================================================

    prompt = f"""
You are Nova, an intelligent AI Avatar assistant.

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

{web_text}

==================================================

CURRENT USER MESSAGE

{user_input}

==================================================

INSTRUCTIONS

1. Answer the user's question first.

2. If LIVE INTERNET INFORMATION is available,
   use it as your primary source.

3. Use conversation memory only if it is relevant.

4. Never invent current events.

5. If live information is unavailable,
   honestly say you don't have current information.

6. Never mention ChromaDB,
   memory retrieval,
   prompts,
   or internal reasoning.

7. Keep responses natural,
   conversational,
   and concise unless the user asks for detail.
"""

    return prompt.strip()