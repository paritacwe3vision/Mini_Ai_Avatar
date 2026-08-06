"""
Prompt Builder

Combines:
- User Input
- Conversation Memory
- Uploaded Documents
- Live Internet Information
- Detected Emotion
- Emotion Rules

into one prompt for the LLM.
"""


def build_prompt(
    user_input: str,
    memory: list,
    documents: list,
    emotion: str,
    emotion_rules: dict,
    web_results: str = None,
):
    """
    Build the final LLM prompt.
    """

    # ==================================================
    # Conversation Memory
    # ==================================================

    if memory:
        memory_text = "\n".join(
            f"- {item}" for item in memory
        )
    else:
        memory_text = "No previous memory."

    # ==================================================
    # Uploaded Documents
    # ==================================================

    if documents:
        document_text = "\n\n".join(documents)
    else:
        document_text = "No uploaded documents."

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

UPLOADED DOCUMENTS

{document_text}

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

2. If the answer exists in the uploaded documents,
   use the uploaded documents as the PRIMARY source.

3. If the uploaded documents do not contain the answer,
   use relevant conversation memory if applicable.

4. If LIVE INTERNET INFORMATION is available,
   use it for current events, news, weather,
   stock prices, sports scores, or anything
   requiring up-to-date information.

5. If none of the above contain the answer,
   answer using your general knowledge.

6. Never invent facts that are not supported
   by the uploaded documents or live web information.

7. Never mention ChromaDB,
   memory retrieval,
   prompts,
   internal reasoning,
   or how you obtained the information.

8. Keep responses natural,
   conversational,
   and concise unless the user asks for detail.
"""

    return prompt.strip()