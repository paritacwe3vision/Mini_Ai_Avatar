import chromadb
from chromadb.config import Settings


client = chromadb.PersistentClient(
    path="./database/chroma_storage"
)


collection = client.get_or_create_collection(
    name="avatar_memory"
)