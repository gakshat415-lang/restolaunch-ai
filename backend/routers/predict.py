from fastapi import APIRouter, HTTPException, Depends
from models.schemas import RestaurantRequest
from services.engine import filter_competitors, calculate_opportunity
from services.llm_service import generate_verdict
from services.auth import get_current_user

router = APIRouter()

@router.post("/predict")
async def predict_opportunity(req: RestaurantRequest, current_user: dict = Depends(get_current_user)):
    # Phase 3: Filtering Funnel
    filtered_df = filter_competitors(req)
    
    # Phase 4: Math Engine Scoring
    result = calculate_opportunity(req, filtered_df)
    
    # Phase 5: Groq LLM Verdict
    verdict = generate_verdict(req, result["opportunity_index"], result["competitor_count"])
    result["verdict"] = verdict
    
    if filtered_df.empty:
        return {
            "message": "No competitors found for this criteria.",
            "data": result
        }
    
    return {
        "message": "Success",
        "data": result
    }

