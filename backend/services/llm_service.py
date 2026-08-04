import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

from services.emotion_service import detect_emotion
from services.emotion_rules import get_emotion_rules
from services.prompt_builder import build_prompt

# ============================================================
# Load Environment Variables
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH)


# ============================================================
# OpenRouter Client
# ============================================================

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    
)


# ============================================================
# AI Avatar Personality
# ============================================================

SYSTEM_PROMPT = """
You are Nova, an intelligent AI Avatar assistant.
RESPONSE STYLE

Speak like a knowledgeable human assistant.

Never sound like documentation,
an instruction manual,
or an AI policy page.

Your replies should feel effortless,
natural,
and conversational.

By default:
- Answer directly.
- Keep responses concise.
- Don't over-explain.
- Don't sound like a textbook.

Only give long explanations when the user clearly asks for them.

PERSONALITY

- Friendly, calm and confident.
- Speak naturally like a real person.
- Sound human, not like an AI generating essays.
- Be warm without being overly enthusiastic.
- Avoid robotic phrases like:
  "Certainly!"
  "I'd be happy to help."
  "It would be my pleasure."
  "Absolutely!"
  unless they genuinely fit the conversation.

CONVERSATION STYLE

Adapt to the user's tone.

- If the user is casual, be casual.
- If the user is professional, be professional.
- If the user is technical, be technical.

Mirror the user's communication style naturally.

RESPONSE LENGTH

Keep responses concise by default.

• Greetings:
  Reply in 1–2 short sentences.

• Simple questions:
  Reply in 2–5 sentences.

• Technical questions:
  Explain clearly but avoid unnecessary details.

• Detailed explanations:
  Give longer responses ONLY if the user asks:
  - explain
  - how
  - why
  - compare
  - teach me
  - tutorial
  - guide
  - in detail
  - step by step

READABILITY

Never produce giant walls of text.

Use:
- Short paragraphs
- Bullet points
- Numbered steps
- Examples

when they improve readability.

Leave a blank line between ideas.

ANSWERING STYLE

Answer the user's question first.

Then provide extra explanation only if it helps.

Avoid repeating the same point.

Do not make every response long.

Do not force follow-up questions.

Only ask one if it naturally fits.

TECHNICAL EXPLANATIONS

When explaining technical concepts:

1. Start with a simple definition.

2. Explain the idea in plain English before using technical terms.

3. Use headings.

4. Use short paragraphs.

5. Give a practical real-world example.

6. If there is a formula,
   explain what each variable means.

7. End with a one-line summary.

Do NOT write like a textbook.

Do NOT dump information.

Teach the concept step by step like an experienced instructor.

-----------------------------------------------------

MEMORY

If the answer comes from previous conversations:

- Simply answer naturally.
- Never explain how your memory works.
- Never mention session memory.
- Never mention privacy.
- Never explain why you know something.
- Never describe your reasoning unless the user explicitly asks.

-----------------------------------------------------

IMPORTANT

Don't try to impress the user by writing more.

The best answer is usually the shortest answer that completely answers the question.

GOAL

Make every conversation feel like talking to a smart,
friendly AI assistant rather than an AI text generator.
"""


# ============================================================
# Decide Response Style
# ============================================================

def get_response_style(user_message: str):

    message = user_message.lower().strip()

    greetings = {
        "hi",
        "hello",
        "hey",
        "hii",
        "heyy",
        "good morning",
        "good afternoon",
        "good evening",
    }

    if message in greetings:
        return (
            "Reply naturally in one or two friendly sentences."
        )

    memory_questions = [
        "my name",
        "who am i",
        "remember",
        "my age",
        "my birthday",
        "my favourite",
        "my favorite",
        "where do i work",
    ]

    if any(k in message for k in memory_questions):
        return (
            "Answer directly in one or two sentences. "
            "Do not explain memory or previous conversations."
        )

    detailed_keywords = [
        "explain",
        "why",
        "how",
        "difference",
        "compare",
        "tutorial",
        "guide",
        "teach",
        "step by step",
        "in detail",
    ]

    if any(k in message for k in detailed_keywords):
        return (
            "Provide a detailed explanation with headings, "
            "examples, and short paragraphs."
        )

    coding_keywords = [
        "code",
        "python",
        "react",
        "fastapi",
        "javascript",
        "css",
        "html",
        "sql",
    ]

    if any(k in message for k in coding_keywords):
        return (
            "Answer clearly. Include code only if useful. "
            "Keep explanations focused."
        )

    if len(message.split()) <= 5:
        return "Reply briefly and naturally."

    return (
        "Answer naturally in a conversational way. "
        "Don't add unnecessary explanations."
    )


# ============================================================
# Generate Response
# ============================================================

# def generate_response(user_message, memories):

#     context = ""

#     for memory in memories:

#         context += f"""

# Previous Conversation

# User:
# {memory["user_message"]}

# Assistant:
# {memory["assistant_response"]}

# """

#     response_style = get_response_style(user_message)
#     user_prompt = f"""
#     Relevant Previous Memory:

#     {context if context else "None"}

#     Current User Message:

#     {user_message}

#     Instructions:

#     {response_style}

#     Follow these rules strictly.

#     - Answer naturally.
#     - Answer the user's question first.
#     - Never explain internal reasoning.
#     - Never explain memory unless asked.
#     - Don't repeat yourself.
#     - Don't write more than necessary.
#     - If a short answer is enough, stop after answering.
#         """

#     response = client.chat.completions.create(

#        
          #model="deepseek/deepseek-r1:free",
        

#         temperature=0.5,

#         max_tokens = 800 if "detailed" in response_style.lower() else 200,

#          extra_body={
#         "provider": {
#             "sort": "throughput"
#         }
#     },
    
#         messages=[
#             {
#                 "role": "system",
#                 "content": SYSTEM_PROMPT,
#             },
#             {
#                 "role": "user",
#                 "content": user_prompt,
#             },
#         ],
#     )

#     return response.choices[0].message.content.strip()

def generate_response(user_message, memories, web_results=None):
    
    # ==========================================================
    # 1. Detect Emotion
    # ==========================================================

    emotion_result = detect_emotion(user_message)

    emotion = emotion_result["emotion"]

    # ==========================================================
    # 2. Get Emotion Rules
    # ==========================================================

    emotion_rules = get_emotion_rules(emotion)

    # ==========================================================
    # 3. Format Retrieved Memories
    # ==========================================================

    memory_list = []

    for memory in memories:

        memory_list.append(
            f"""
User:
{memory["user_message"]}

Assistant:
{memory["assistant_response"]}
"""
        )

    # ==========================================================
    # 4. Build Final Prompt
    # ==========================================================

    final_prompt = build_prompt(
        user_input=user_message,
        memory=memory_list,
        emotion=emotion,
        emotion_rules=emotion_rules,
        web_results=web_results,
    )

    # ==========================================================
    # 5. Response Style
    # ==========================================================

    response_style = get_response_style(user_message)

    # ==========================================================
    # 6. Call LLM
    # ==========================================================

    response = client.chat.completions.create(

        model="deepseek/deepseek-chat-v3.1",

        temperature=0.5,

        max_tokens=800 if "detailed" in response_style.lower() else 200,

        extra_body={
            "provider": {
                "sort": "throughput"
            }
        },

        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": final_prompt,
            },
        ],
    )

    # ==========================================================
    # 7. Return Reply + Emotion
    # ==========================================================

    return {
        "reply": response.choices[0].message.content.strip(),
        "emotion": emotion,
    }