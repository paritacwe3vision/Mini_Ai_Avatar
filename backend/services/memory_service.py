from database.chroma_db import collection
from datetime import datetime
import uuid


def save_memory(user_message, assistant_response):
    """
    Store conversation in ChromaDB
    """

    collection.add(
        ids=[str(uuid.uuid4())],

        documents=[
            user_message
        ],

        metadatas=[
            {
                "assistant_response": assistant_response,
                "timestamp": str(datetime.now()),
                "type": "conversation"
            }
        ]
    )


def search_memory(query):
    """
    Retrieve previous conversations
    """

    results = collection.query(
        query_texts=[query],
        n_results=3,

        include=[
            "documents",
            "metadatas",
            "distances"
        ]
    )

    memories = []


    if results["documents"]:

        for i in range(len(results["documents"][0])):

            memories.append(
                {
                    "user_message": results["documents"][0][i],
                    "assistant_response": results["metadatas"][0][i]
                    ["assistant_response"],
                    "timestamp": results["metadatas"][0][i]
                    ["timestamp"]
                }
            )


    return memories