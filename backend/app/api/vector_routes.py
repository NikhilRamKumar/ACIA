from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.update import CompetitorUpdate
from app.services.vector_service import (
    index_single_update,
    rebuild_index_from_updates,
    search_similar_updates,
    build_text_for_embedding,
    VECTOR_AVAILABLE
)

router = APIRouter(
    prefix="/vector",
    tags=["Vector Search"]
)


@router.post("/index/{update_id}")
def index_update(update_id: int, db: Session = Depends(get_db)):
    if not VECTOR_AVAILABLE:
        return {
            "status": "disabled",
            "message": "Vector search is disabled in deployment because FAISS is not installed.",
            "update_id": update_id
        }

    update = db.query(CompetitorUpdate).filter(
        CompetitorUpdate.id == update_id
    ).first()

    if not update:
        raise HTTPException(
            status_code=404,
            detail="Update not found"
        )

    result = index_single_update(update)

    return result


@router.post("/index-all")
def index_all_updates(db: Session = Depends(get_db)):
    if not VECTOR_AVAILABLE:
        return {
            "status": "disabled",
            "message": "Vector search is disabled in deployment because FAISS is not installed.",
            "indexed_count": 0
        }

    updates = db.query(CompetitorUpdate).all()

    if not updates:
        return {
            "message": "No updates found",
            "indexed_count": 0
        }

    result = rebuild_index_from_updates(updates)

    return result


@router.get("/similar/{update_id}")
def get_similar_updates(
    update_id: int,
    top_k: int = 3,
    db: Session = Depends(get_db)
):
    if not VECTOR_AVAILABLE:
        return {
            "status": "disabled",
            "message": "Vector search is disabled in deployment because FAISS is not installed.",
            "update_id": update_id,
            "similar_updates": []
        }

    update = db.query(CompetitorUpdate).filter(
        CompetitorUpdate.id == update_id
    ).first()

    if not update:
        raise HTTPException(
            status_code=404,
            detail="Update not found"
        )

    query_text = build_text_for_embedding(update)

    similar_updates = search_similar_updates(
        query_text=query_text,
        top_k=top_k + 1
    )

    filtered_results = [
        item for item in similar_updates
        if item["update_id"] != update_id
    ]

    return {
        "update_id": update.id,
        "title": update.title,
        "similar_updates": filtered_results[:top_k]
    }


@router.get("/search")
def search_updates(query: str, top_k: int = 5):
    if not VECTOR_AVAILABLE:
        return {
            "status": "disabled",
            "message": "Vector search is disabled in deployment because FAISS is not installed.",
            "query": query,
            "results": []
        }

    results = search_similar_updates(
        query_text=query,
        top_k=top_k
    )

    return {
        "query": query,
        "results": results
    }