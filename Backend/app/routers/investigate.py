from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.services.ai_service import run_investigation

router = APIRouter(prefix="/investigate", tags=["investigate"])

class InvestigationRequest(BaseModel):
    text: Optional[str] = None
    url: Optional[str] = None
    is_demo: bool = False

@router.post("/full")
@router.post("")
@router.post("/")
async def analyze_full_investigation(request: InvestigationRequest):
    """
    Run complete 360-degree ATHENA investigation:
    Claim Extraction, Trust Passport, Perspective Explorer, Narrative Memory, AI Tutor & Quiz.
    """
    try:
        if not request.text and not request.url and not request.is_demo:
            raise HTTPException(status_code=400, detail="Provide text, URL, or set is_demo=True")
        
        result = await run_investigation(
            text=request.text or "",
            url=request.url,
            is_demo_mode=request.is_demo
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/demo")
async def get_pitch_demo():
    """
    Return pitch-ready deterministic demo payload for UNESCO Youth Hackathon 2026.
    """
    return await run_investigation(text="", is_demo_mode=True)
