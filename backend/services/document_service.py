import os
import shutil
import uuid
from pathlib import Path

import chromadb

from pypdf import PdfReader
from docx import Document

from sentence_transformers import SentenceTransformer
from langchain_text_splitters import RecursiveCharacterTextSplitter


# ==========================================================
# Base Directory
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

UPLOAD_DIR = BASE_DIR / "uploads" / "documents"

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ==========================================================
# Chroma DB
# ==========================================================

DB_PATH = BASE_DIR / "database" / "chroma_db"

client = chromadb.PersistentClient(
    path=str(DB_PATH)
)

collection = client.get_or_create_collection(
    name="documents"
)

# ==========================================================
# Active Document
# ==========================================================

ACTIVE_DOCUMENT = None
# ==========================================================
# Embedding Model
# ==========================================================

embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


# ==========================================================
# Text Splitter
# ==========================================================

text_splitter = RecursiveCharacterTextSplitter(

    chunk_size=800,

    chunk_overlap=150,

    separators=[
        "\n\n",
        "\n",
        ". ",
        " ",
        ""
    ]
)


# ==========================================================
# Allowed Extensions
# ==========================================================

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx"
}


# ==========================================================
# Read PDF
# ==========================================================

def read_pdf(file_path):

    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:

        page_text = page.extract_text()

        if page_text:

            text += page_text + "\n"

    return text


# ==========================================================
# Read DOCX
# ==========================================================

def read_docx(file_path):

    doc = Document(file_path)

    return "\n".join(

        paragraph.text

        for paragraph in doc.paragraphs

    )


# ==========================================================
# Save + Learn Document
# ==========================================================

def save_document(file):

    global ACTIVE_DOCUMENT

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:

        raise ValueError(
            "Only PDF and DOCX files are supported."
        )

    destination = UPLOAD_DIR / file.filename

    with open(destination, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

   # print(f"✅ Saved: {destination}")


    # ---------------------------------------------
    # Read document
    # ---------------------------------------------

    #print("📖 Reading document...")

    if extension == ".pdf":

        text = read_pdf(destination)

    else:

        text = read_docx(destination)


    print("Characters extracted:", len(text))


    if not text.strip():

        raise ValueError(
            "No readable text found in document."
        )


    # ---------------------------------------------
    # Split into chunks
    # ---------------------------------------------

   # print("✂️ Splitting text...")

    chunks = text_splitter.split_text(text)

   # print(f"📄 Chunks Created: {len(chunks)}")


    # ---------------------------------------------
    # Generate embeddings
    # ---------------------------------------------

    #print("🧠 Creating embeddings...")

    embeddings = embedding_model.encode(
        chunks
    ).tolist()

    #print("✅ Embeddings created")

    ids = [
        str(uuid.uuid4())
        for _ in chunks
    ]

    metadatas = [

    {
        "filename": file.filename,
        "chunk": index + 1
    }

    for index in range(len(chunks))

]

# ---------------------------------------------
# Remove previous version of same file
# ---------------------------------------------

    existing = collection.get(
        where={"filename": file.filename}
    )

    if existing["ids"]:
        collection.delete(ids=existing["ids"])
        
    collection.add(

        ids=ids,

        documents=chunks,

        embeddings=embeddings,

        metadatas=metadatas

    )
    collection.add(
    ids=ids,
    documents=chunks,
    embeddings=embeddings,
    metadatas=metadatas
)

# ---------------------------------------------
# Delete uploaded file after embedding
# ---------------------------------------------

    try:
        os.remove(destination)
        print("🗑️ Original document deleted.")
    except Exception as e:
        print(f"⚠️ Could not delete file: {e}")

    #print("✅ Document stored in ChromaDB")

    ACTIVE_DOCUMENT = file.filename

   # print(f"📂 Active document: {ACTIVE_DOCUMENT}")

    return {

        "filename": file.filename,

        "path": str(destination),

        "chunks": len(chunks)

    }
# ==========================================================
# Search Documents
# ==========================================================
def search_documents(query, n_results=5, threshold=2.0):

    global ACTIVE_DOCUMENT

    # ---------------------------------------------
    # No active document
    # ---------------------------------------------

    if ACTIVE_DOCUMENT is None:

        print("⚠️ No active document.")

        return []
    query_embedding = embedding_model.encode(
        query
    ).tolist()

    results = collection.query(

        query_embeddings=[query_embedding],

        n_results=n_results,

        where={
            "filename": ACTIVE_DOCUMENT
        },

        include=[
            "documents",
            "metadatas",
            "distances"
        ]
    )

    documents = []

    if not results["documents"]:
        return documents

    for doc, metadata, distance in zip(

        results["documents"][0],

        results["metadatas"][0],

        results["distances"][0],

    ):

        if distance <= threshold:

            documents.append(

                f"""
Source Document: {metadata['filename']}

{doc}
"""
            )

    return documents