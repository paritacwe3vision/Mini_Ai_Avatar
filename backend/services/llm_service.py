import os
from dotenv import load_dotenv
from pathlib import Path
from openai import OpenAI


BASE_DIR = Path(__file__).resolve().parent.parent.parent

ENV_PATH = BASE_DIR / ".env"

load_dotenv(
    dotenv_path=ENV_PATH
)


client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

def generate_response(user_message, memories):


    context = ""


    for memory in memories:

        context += f"""
Previous conversation:

User:
{memory['user_message']}

Assistant:
{memory['assistant_response']}
"""


    prompt = f"""

You are an AI Avatar assistant.

Use previous memories when useful.

Memory:
{context}


Current User Message:

{user_message}


Give a natural human-like answer.

"""


    response = client.chat.completions.create(

        model="meta-llama/llama-3.1-8b-instruct",

        messages=[
            {
                "role":"system",
                "content":
                "You are a helpful AI Avatar."
            },

            {
                "role":"user",
                "content":prompt
            }
        ]

    )


    return response.choices[0].message.content