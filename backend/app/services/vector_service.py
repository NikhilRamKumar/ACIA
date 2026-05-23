import os
import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer


VECTOR_DIR = "vector_store"
INDEX_PATH = os.path.join(VECTOR_DIR, "faiss_index.bin")
METADATA_PATH = os.path.join(VECTOR_DIR, "metadata.json")

EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

model = SentenceTransformer(EMBEDDING_MODEL_NAME)


def ensure_vector_dir():
    if not os.path.exists(VECTOR_DIR):
        os.makedirs(VECTOR_DIR)


def get_embedding(text: str):
    """
    Converts text into embedding vector.
    """

    if not text:
        text = ""

    embedding = model.encode([text])
    embedding = np.array(embedding).astype("float32")

    return embedding


def load_metadata():
    ensure_vector_dir()

    if not os.path.exists(METADATA_PATH):
        return []

    with open(METADATA_PATH, "r", encoding="utf-8") as file:
        return json.load(file)


def save_metadata(metadata):
    ensure_vector_dir()

    with open(METADATA_PATH, "w", encoding="utf-8") as file:
        json.dump(metadata, file, indent=4, ensure_ascii=False)


def load_or_create_index(dimension: int = 384):
    ensure_vector_dir()

    if os.path.exists(INDEX_PATH):
        return faiss.read_index(INDEX_PATH)

    index = faiss.IndexFlatL2(dimension)
    return index


def save_index(index):
    ensure_vector_dir()
    faiss.write_index(index, INDEX_PATH)


def build_text_for_embedding(update):
    """
    Combines important update fields into one searchable text.
    """

    parts = [
        update.title or "",
        update.content or "",
        update.summary or "",
        update.category or "",
        update.threat_reason or ""
    ]

    return " ".join(parts)


def index_single_update(update):
    """
    Adds one competitor update into FAISS vector index.
    Avoids duplicate indexing using update_id.
    """

    metadata = load_metadata()

    for item in metadata:
        if item["update_id"] == update.id:
            return {
                "message": "Update already indexed",
                "update_id": update.id
            }

    text = build_text_for_embedding(update)
    embedding = get_embedding(text)

    dimension = embedding.shape[1]
    index = load_or_create_index(dimension)

    index.add(embedding)

    metadata.append({
        "update_id": update.id,
        "title": update.title,
        "url": update.url,
        "category": update.category,
        "threat_score": update.threat_score,
        "summary": update.summary
    })

    save_index(index)
    save_metadata(metadata)

    return {
        "message": "Update indexed successfully",
        "update_id": update.id
    }


def rebuild_index_from_updates(updates):
    """
    Rebuilds FAISS index from all stored competitor updates.
    Useful when index file is missing or corrupted.
    """

    ensure_vector_dir()

    metadata = []

    index = None

    for update in updates:
        text = build_text_for_embedding(update)
        embedding = get_embedding(text)

        if index is None:
            dimension = embedding.shape[1]
            index = faiss.IndexFlatL2(dimension)

        index.add(embedding)

        metadata.append({
            "update_id": update.id,
            "title": update.title,
            "url": update.url,
            "category": update.category,
            "threat_score": update.threat_score,
            "summary": update.summary
        })

    if index is None:
        index = faiss.IndexFlatL2(384)

    save_index(index)
    save_metadata(metadata)

    return {
        "message": "Vector index rebuilt successfully",
        "indexed_count": len(metadata)
    }


def search_similar_updates(query_text: str, top_k: int = 3):
    """
    Searches FAISS index and returns top similar updates.
    """

    metadata = load_metadata()

    if not metadata:
        return []

    query_embedding = get_embedding(query_text)

    index = load_or_create_index(query_embedding.shape[1])

    if index.ntotal == 0:
        return []

    distances, indices = index.search(query_embedding, top_k)

    results = []

    for distance, idx in zip(distances[0], indices[0]):
        if idx == -1:
            continue

        if idx >= len(metadata):
            continue

        item = metadata[idx]

        results.append({
            "update_id": item["update_id"],
            "title": item["title"],
            "url": item["url"],
            "category": item["category"],
            "threat_score": item["threat_score"],
            "summary": item["summary"],
            "distance": float(distance)
        })

    return results