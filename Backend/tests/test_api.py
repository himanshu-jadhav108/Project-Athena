import json
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "ATHENA" in response.json()["name"]

def test_claims_demo():
    response = client.get("/claims/demo")
    assert response.status_code == 200
    assert len(response.json()["demo_claims"]) > 0

def test_claims_analyze():
    response = client.post("/claims/analyze", json={"text": "Climate change is real"})
    assert response.status_code == 200
    data = response.json()
    assert "claims" in data
    assert len(data["claims"]) > 0

def test_bias_detect():
    response = client.post("/bias/detect", json={"text": "This is absolutely terrifying! Everyone knows this is the worst thing ever!"})
    assert response.status_code == 200
    data = response.json()
    assert "flags" in data
    assert data["overall_bias_score"] > 0

def test_source_score():
    response = client.post("/source/score", json={"url": "https://bbc.com/news"})
    assert response.status_code == 200
    data = response.json()
    assert "overall_score" in data
    assert data["overall_score"] > 50

def test_quiz_questions():
    response = client.post("/quiz/questions", json={"limit": 3})
    assert response.status_code == 200
    assert len(response.json()["questions"]) > 0

def test_quiz_categories():
    response = client.get("/quiz/categories")
    assert response.status_code == 200
    assert "categories" in response.json()

def test_source_dataset():
    response = client.get("/source/dataset")
    assert response.status_code == 200
    assert "dataset" in response.json()

def test_bias_reference():
    response = client.get("/bias/flags-reference")
    assert response.status_code == 200
    assert "emotional_triggers" in response.json()

def test_forensics_health():
    response = client.get("/forensics/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_investigate_demo():
    response = client.get("/investigate/demo")
    assert response.status_code == 200
    data = response.json()
    assert data["is_demo"] is True
    assert data["mode"] == "demo"
    assert isinstance(data["provenance"], dict)
    assert data["provenance"]["mode"] == "demo"
    assert data["provenance"]["evidence_status"] == "curated"
    assert data["provenance"]["historical_status"] == "curated"
    assert data["status"] == "success"
    assert "trust_passport" in data and data["trust_passport"] is not None
    assert "perspective_explorer" in data and data["perspective_explorer"] is not None
    assert "narrative_memory" in data and data["narrative_memory"] is not None
    assert "ai_tutor" in data and data["ai_tutor"] is not None

def test_investigate_full_demo_mode():
    response = client.post("/investigate/full", json={"text": "", "is_demo": True})
    assert response.status_code == 200
    data = response.json()
    assert data["is_demo"] is True
    assert data["mode"] == "demo"
    assert isinstance(data["provenance"], dict)
    assert data["provenance"]["mode"] == "demo"
    assert data["status"] == "success"

def test_investigate_full_live_unavailable_without_valid_key():
    response = client.post("/investigate/full", json={"text": "Arbitrary claim text for testing", "is_demo": False})
    assert response.status_code == 200
    data = response.json()
    # In test environment without a live Gemini key, should return structured unavailable response
    assert data["is_demo"] is False
    assert data["mode"] == "unavailable"
    assert isinstance(data["provenance"], dict)
    assert data["provenance"]["mode"] == "unavailable"
    assert data["provenance"]["evidence_status"] == "unavailable"
    assert data["provenance"]["historical_status"] == "unavailable"
    assert data["status"] == "unavailable"
    assert data["trust_passport"] is None
    assert data["perspective_explorer"] is None
    assert data["narrative_memory"] is None
    assert data["ai_tutor"] is None
    assert "error_message" in data

def test_arbitrary_claim_never_receives_demo_evidence():
    arbitrary_claim = "Eating purple mushrooms cures all known diseases instantly."
    response = client.post("/investigate/full", json={"text": arbitrary_claim, "is_demo": False})
    assert response.status_code == 200
    data = response.json()
    
    # Must NOT have returned curated demo evidence
    assert data["mode"] != "demo"
    assert data["provenance"]["mode"] != "demo"
    assert data["provenance"]["evidence_status"] != "curated"
    if data["trust_passport"] is not None:
        # If live AI was somehow active, it must not be the quantum frequency scan demo
        assert "quantum frequency" not in json.dumps(data).lower()
    else:
        assert data["mode"] == "unavailable"
        assert data["provenance"]["mode"] == "unavailable"

@pytest.mark.asyncio
async def test_live_ai_provider_structure_validation():
    from app.services.ai_service import LiveAIProvider
    
    provider = LiveAIProvider(api_key="valid-dummy-key-for-test-12345")
    
    # Valid payload test
    valid_payload = {
        "claim_summary": {"primary_claim": "Test claim", "sub_claims": [], "domain": "Tech", "virality_risk": "Low"},
        "trust_passport": {"claim": "Test claim", "assessment": "Evidence is mixed.", "evidence": {}},
        "perspective_explorer": {"perspectives": [], "common_ground": "None"},
        "narrative_memory": {"title": "History", "timeline": [{"step": 1, "headline": "Init"}]},
        "ai_tutor": {"explanation": {}, "quiz": {}}
    }
    validated = provider._validate_structure(valid_payload, "Test claim")
    assert validated is not None
    assert validated["mode"] == "live"
    assert isinstance(validated["provenance"], dict)
    assert validated["provenance"]["mode"] == "live"
    assert validated["provenance"]["evidence_status"] == "ai_assessed"
    assert validated["provenance"]["historical_status"] == "grounded"
    assert validated["is_demo"] is False
    assert validated["status"] == "success"

    # Malformed payload test (missing required top keys)
    malformed_payload = {"trust_passport": {"claim": "Incomplete"}}
    assert provider._validate_structure(malformed_payload, "Test claim") is None


