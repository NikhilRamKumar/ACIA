from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.update import CompetitorUpdate
from app.services.ai_service import (
    summarize_competitor_update,
    analyze_competitor_update,
    predict_competitor_next_move
)
from app.services.vector_service import (
    search_similar_updates,
    build_text_for_embedding
)
router = APIRouter(
    prefix="/ai",
    tags=["AI Services"]
)


@router.post("/updates/summarize-all")
def summarize_all_updates(db: Session = Depends(get_db)):
    updates = db.query(CompetitorUpdate).filter(
        CompetitorUpdate.summary == None
    ).all()

    if not updates:
        return {
            "message": "No unsummarized updates found",
            "summarized_count": 0
        }

    summarized_count = 0
    failed_updates = []

    for update in updates:
        try:
            summary = summarize_competitor_update(
                title=update.title,
                content=update.content
            )

            update.summary = summary
            db.commit()
            db.refresh(update)

            summarized_count += 1

        except Exception as e:
            failed_updates.append({
                "update_id": update.id,
                "title": update.title,
                "error": str(e)
            })

    return {
        "message": "Bulk summarization completed",
        "summarized_count": summarized_count,
        "failed_count": len(failed_updates),
        "failed_updates": failed_updates
    }


@router.post("/updates/analyze-all")
def analyze_all_updates(db: Session = Depends(get_db)):
    updates = db.query(CompetitorUpdate).filter(
        CompetitorUpdate.category == None
    ).all()

    if not updates:
        return {
            "message": "No unanalyzed updates found",
            "analyzed_count": 0
        }

    analyzed_count = 0
    failed_updates = []

    for update in updates:
        try:
            analysis = analyze_competitor_update(
                title=update.title,
                content=update.content,
                summary=update.summary
            )

            update.category = analysis.get("category", "Other")
            update.threat_score = analysis.get("threat_score", 4)
            update.threat_reason = analysis.get(
                "threat_reason",
                "No detailed threat reason generated."
            )

            db.commit()
            db.refresh(update)

            analyzed_count += 1

        except Exception as e:
            failed_updates.append({
                "update_id": update.id,
                "title": update.title,
                "error": str(e)
            })

    return {
        "message": "Bulk analysis completed",
        "analyzed_count": analyzed_count,
        "failed_count": len(failed_updates),
        "failed_updates": failed_updates
    }


@router.post("/updates/{update_id}/summarize")
def summarize_single_update(update_id: int, db: Session = Depends(get_db)):
    update = db.query(CompetitorUpdate).filter(
        CompetitorUpdate.id == update_id
    ).first()

    if not update:
        raise HTTPException(
            status_code=404,
            detail="Update not found"
        )

    try:
        summary = summarize_competitor_update(
            title=update.title,
            content=update.content
        )

        update.summary = summary

        db.commit()
        db.refresh(update)

        return {
            "message": "Summary generated successfully",
            "update_id": update.id,
            "title": update.title,
            "summary": update.summary
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Summarization failed: {str(e)}"
        )


@router.post("/updates/{update_id}/analyze")
def analyze_single_update(update_id: int, db: Session = Depends(get_db)):
    update = db.query(CompetitorUpdate).filter(
        CompetitorUpdate.id == update_id
    ).first()

    if not update:
        raise HTTPException(
            status_code=404,
            detail="Update not found"
        )

    try:
        analysis = analyze_competitor_update(
            title=update.title,
            content=update.content,
            summary=update.summary
        )

        update.category = analysis.get("category", "Other")
        update.threat_score = analysis.get("threat_score", 4)
        update.threat_reason = analysis.get(
            "threat_reason",
            "No detailed threat reason generated."
        )

        db.commit()
        db.refresh(update)

        return {
            "message": "Analysis completed successfully",
            "update_id": update.id,
            "title": update.title,
            "category": update.category,
            "threat_score": update.threat_score,
            "threat_reason": update.threat_reason
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )
@router.post("/updates/predict-all")
def predict_all_updates(db: Session = Depends(get_db)):
    updates = db.query(CompetitorUpdate).filter(
        CompetitorUpdate.prediction == None
    ).all()

    if not updates:
        return {
            "message": "No updates pending prediction",
            "predicted_count": 0
        }

    predicted_count = 0
    failed_updates = []

    for update in updates:
        try:
            query_text = build_text_for_embedding(update)

            similar_updates = search_similar_updates(
                query_text=query_text,
                top_k=4
            )

            similar_updates = [
                item for item in similar_updates
                if item["update_id"] != update.id
            ][:3]

            prediction_result = predict_competitor_next_move(
                title=update.title,
                content=update.content,
                summary=update.summary,
                category=update.category,
                threat_score=update.threat_score,
                similar_updates=similar_updates
            )

            update.prediction = prediction_result.get("prediction")
            update.confidence_level = prediction_result.get("confidence_level")
            update.recommended_response = prediction_result.get("recommended_response")

            db.commit()
            db.refresh(update)

            predicted_count += 1

        except Exception as e:
            failed_updates.append({
                "update_id": update.id,
                "title": update.title,
                "error": str(e)
            })

    return {
        "message": "Bulk prediction completed",
        "predicted_count": predicted_count,
        "failed_count": len(failed_updates),
        "failed_updates": failed_updates
    }


@router.post("/updates/{update_id}/predict")
def predict_single_update(update_id: int, db: Session = Depends(get_db)):
    update = db.query(CompetitorUpdate).filter(
        CompetitorUpdate.id == update_id
    ).first()

    if not update:
        raise HTTPException(
            status_code=404,
            detail="Update not found"
        )

    try:
        query_text = build_text_for_embedding(update)

        similar_updates = search_similar_updates(
            query_text=query_text,
            top_k=4
        )

        similar_updates = [
            item for item in similar_updates
            if item["update_id"] != update.id
        ][:3]

        prediction_result = predict_competitor_next_move(
            title=update.title,
            content=update.content,
            summary=update.summary,
            category=update.category,
            threat_score=update.threat_score,
            similar_updates=similar_updates
        )

        update.prediction = prediction_result.get("prediction")
        update.confidence_level = prediction_result.get("confidence_level")
        update.recommended_response = prediction_result.get("recommended_response")

        db.commit()
        db.refresh(update)

        return {
            "message": "Prediction generated successfully",
            "update_id": update.id,
            "title": update.title,
            "prediction": update.prediction,
            "confidence_level": update.confidence_level,
            "recommended_response": update.recommended_response,
            "similar_updates_used": similar_updates
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )