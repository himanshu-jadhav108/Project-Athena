"""
AI Service Abstraction Layer for ATHENA — AI-Powered Media Literacy Platform.
Includes modular AI provider interface, fallback handlers, and pitch-ready demo engines.
Enforces non-binary, epistemologically sound assessment language.
"""

import os
import json
import re
import httpx
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

# ───────────────────────────────────────────────
# DETERMINISTIC DEMO DATASET FOR UNESCO PITCH
# ───────────────────────────────────────────────
DEMO_INVESTIGATION_PAYLOAD = {
    "claim_id": "demo-claim-2026-unesco",
    "is_demo": True,
    "mode": "demo",
    "provenance": {
        "mode": "demo",
        "evidence_status": "curated",
        "historical_status": "curated"
    },
    "status": "success",
    "input_text": "BREAKING: Scientists have officially approved a revolutionary technology that can eliminate all digital misinformation automatically using AI quantum frequency scans.",
    "claim_summary": {
        "primary_claim": "Scientists approved a revolutionary AI quantum frequency technology that automatically eliminates all digital misinformation.",
        "sub_claims": [
            "AI quantum frequency scanning is scientifically validated.",
            "Misinformation can be 100% eliminated automatically without human oversight."
        ],
        "domain": "Technology & Science",
        "virality_risk": "High"
    },
    "trust_passport": {
        "claim": "Scientists approved an automated quantum AI system that eradicates digital misinformation.",
        "source": {
            "origin": "Unverified Viral Social Media Post (x.com / Telegram)",
            "publisher": "Unknown Digital Account ('@TechBreakthroughsToday')",
            "domain_authority": 18,
            "transparency_score": "Low",
            "first_seen": "2026-08-10T14:32:00Z"
        },
        "evidence": {
            "supporting_count": 0,
            "conflicting_count": 4,
            "unverified_count": 2,
            "supporting_items": [],
            "conflicting_items": [
                {
                    "title": "Quantum AI Misinformation Scams: A Fact Check",
                    "publisher": "International Fact-Checking Network (IFCN)",
                    "url": "",
                    "relevance": 96,
                    "verdict": "Contradicted — No peer-reviewed paper or official scientific body supports this claim."
                },
                {
                    "title": "MIT Technology Review on Automated Misinformation Detection Limits",
                    "publisher": "MIT Technology Review",
                    "url": "",
                    "relevance": 92,
                    "verdict": "Contradicted — Current AI systems cannot determine absolute truth without context."
                },
                {
                    "title": "UNESCO Statement on MIL and AI Verification Tools",
                    "publisher": "UNESCO Communication and Information",
                    "url": "",
                    "relevance": 90,
                    "verdict": "Context — Media literacy emphasizes critical thinking over automated censorship."
                }
            ],
            "unverified_items": [
                {
                    "title": "Patented Quantum Wave Scanner Concept Draft",
                    "publisher": "Unverified Patent Application",
                    "url": "",
                    "relevance": 45,
                    "verdict": "Unverified draft patent without peer evaluation."
                }
            ]
        },
        "context": {
            "missing_context": [
                "No specific research institution or lead scientist is named in the announcement.",
                "The term 'Quantum AI Frequency Scan' uses buzzwords not recognized in peer-reviewed computer science literature.",
                "Automated text moderation cannot infer real-world intent or offline context."
            ],
            "historical_precedent": "Similar sensationalized tech claims surface frequently around high-profile global summits to generate engagement."
        },
        "language_analysis": {
            "emotional_framing": "High",
            "sensationalism_score": 88,
            "loaded_words": ["BREAKING", "officially approved", "revolutionary", "eliminate all", "automatically"],
            "tone": "Urgent, sensational, authoritative without citation"
        },
        "ai_generation_indicators": {
            "detected": True,
            "confidence": "Medium-High",
            "details": "Repetitive synthetic syntax patterns typical of engagement-bait copy generators."
        },
        "assessment": "Evidence is currently insufficient to support this claim. Key scientific context is missing.",
        "assessment_code": "INSUFFICIENT_EVIDENCE",
        "confidence_level": "High (Confidence in lack of evidence)",
        "uncertainty_notes": "No official press releases from accredited universities have been published regarding this technology.",
        "suggested_actions": [
            "Verify whether a peer-reviewed paper exists in PubMed, arXiv, or Nature.",
            "Check if major scientific bodies (IEEE, ACM, UNESCO) have released statements.",
            "Inspect the publisher account's creation date and history of sensational posts."
        ]
    },
    "perspective_explorer": {
        "perspectives": [
            {
                "category": "Scientific & Academic",
                "source_name": "IEEE Spectrum / Computer Science Faculty",
                "stance": "Skeptical",
                "summary": "Highlights that 'quantum frequency scanning' is technically meaningless for digital text analysis.",
                "quote": "Natural language processing requires contextual understanding, not physics-based frequency scans."
            },
            {
                "category": "Fact-Checking Community",
                "source_name": "PolitiFact & Snopes Joint Brief",
                "stance": "Debunked",
                "summary": "Traced the claim back to a clickbait technology blog selling crypto tokens.",
                "quote": "The claim inflates hypothetical research concepts into a fabricated breakthrough."
            },
            {
                "category": "International Organizations",
                "source_name": "UNESCO Media & Information Literacy Expert Group",
                "stance": "Educational",
                "summary": "Stresses that media literacy cannot be replaced by automated black-box software.",
                "quote": "Empowering citizens with critical evaluation skills is the key to resilient information ecosystems."
            },
            {
                "category": "Social Media Community",
                "source_name": "Reddit r/Technology & Tech Twitter",
                "stance": "Mixed / Viral Concern",
                "summary": "Viral interest among readers, with top comments questioning the lack of peer review.",
                "quote": "Sounds like another hype campaign—where is the GitHub repository or whitepaper?"
            }
        ],
        "common_ground": "All credible scientific and educational bodies agree that no fully automated technology can eliminate misinformation without human context.",
        "key_differences": "Tech blogs focus on hype and virality, whereas academic and fact-checking institutions focus on empirical methodology.",
        "remaining_uncertainties": "Whether the post was an intentional satire piece or a commercial scam campaign."
    },
    "narrative_memory": {
        "title": "Evolution of the 'Quantum AI Misinformation Cure' Narrative",
        "timeline": [
            {
                "step": 1,
                "date": "2026-08-01",
                "event_type": "ORIGINAL_PAPER_CONCEPT",
                "source": "Speculative Computer Science Blog",
                "headline": "Could Quantum Computing Hypothetically Speed Up Text Parsing?",
                "what_changed": "Theoretical academic discussion on computing speed.",
                "confidence": "High",
                "details": "A speculative article discussed theoretical quantum algorithms."
            },
            {
                "step": 2,
                "date": "2026-08-05",
                "event_type": "HEADLINE_MANIPULATION",
                "source": "Tech Buzz Site ('FutureTechDaily')",
                "headline": "Quantum AI Breakthrough Set to Scan All Web Content!",
                "what_changed": "Hypothetical concept framed as an imminent commercial product.",
                "confidence": "Medium",
                "details": "Sensationalized headline added to attract clicks."
            },
            {
                "step": 3,
                "date": "2026-08-08",
                "event_type": "VIRAL_AMPLIFICATION",
                "source": "Social Media Bots & Influencers",
                "headline": "BREAKING: Scientists approve technology that eliminates all digital misinformation!",
                "what_changed": "Added fake scientific approval authority and absolute claim ('eliminate all').",
                "confidence": "High",
                "details": "Shared 45,000+ times across channels with engagement bait."
            },
            {
                "step": 4,
                "date": "2026-08-11",
                "event_type": "FACT_CHECK_CORRECTION",
                "source": "ATHENA & Independent Fact-Checkers",
                "headline": "Fact Check: No Quantum AI Tool Has Been Approved to Eliminate Misinformation",
                "what_changed": "Debunking articles published providing missing context.",
                "confidence": "High",
                "details": "Clarified that no such technology exists or has been validated."
            }
        ]
    },
    "ai_tutor": {
        "explanation": {
            "core_concept": "Recognizing Sensationalized Absolute Claims",
            "why_misleading": "Notice the use of absolute words like 'officially approved' and 'eliminate ALL misinformation'. Real scientific advances are communicated with specific methodology, peer review details, and nuanced limitations.",
            "literacy_skills_taught": [
                "Identify loaded emotional trigger words ('BREAKING', 'revolutionary').",
                "Look for named scientific institutions rather than generic 'Scientists'.",
                "Be wary of technical buzzword mashups ('Quantum AI Frequency')."
            ]
        },
        "quiz": {
            "title": "Mini Learning Challenge: Spotting Misleading Framing",
            "questions": [
                {
                    "id": "q1",
                    "question": "Which of these headlines demonstrates proper scientific nuance?",
                    "options": [
                        "A. 'Scientists DESTROY shocking myth with magic new AI tool!'",
                        "B. 'Study evaluates potential of machine learning in assisting fact-checkers.'",
                        "C. 'New invention officially cures all online fake news overnight!'"
                    ],
                    "correct_option": 1,
                    "explanation": "Option B uses guarded, precise language ('evaluates potential', 'assisting'). Science rarely claims absolute overnight cures."
                },
                {
                    "id": "q2",
                    "question": "When a claim mentions 'Scientists have approved...', what is the best immediate step?",
                    "options": [
                        "A. Share it immediately so friends stay safe.",
                        "B. Assume it is true because the word 'Scientists' is used.",
                        "C. Check which specific institution published the peer-reviewed paper."
                    ],
                    "correct_option": 2,
                    "explanation": "Always verify which university or journal published the research. Anonymous authority claims are a classic red flag."
                }
            ]
        }
    }
}


# ───────────────────────────────────────────────
# HELPER FOR STRUCTURED UNAVAILABLE RESPONSES
# ───────────────────────────────────────────────

def build_unavailable_response(
    text: str,
    error_code: str = "LIVE_ANALYSIS_UNAVAILABLE",
    error_message: str = "ATHENA could not complete this analysis reliably."
) -> Dict[str, Any]:
    """
    Returns an honest, structured analysis-unavailable response.
    Guarantees that deterministic demo evidence is NEVER substituted for arbitrary input.
    """
    return {
        "claim_id": f"unavailable-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}",
        "is_demo": False,
        "mode": "unavailable",
        "provenance": {
            "mode": "unavailable",
            "evidence_status": "unavailable",
            "historical_status": "unavailable"
        },
        "status": "unavailable",
        "error_code": error_code,
        "error_message": error_message,
        "input_text": text or "",
        "claim_summary": None,
        "trust_passport": None,
        "perspective_explorer": None,
        "narrative_memory": None,
        "ai_tutor": None,
    }


# ───────────────────────────────────────────────
# AI PROVIDER ABSTRACT BASE CLASS & IMPLEMENTATION
# ───────────────────────────────────────────────

class BaseAIProvider:
    """Base class for AI Providers in ATHENA."""
    async def analyze_content(self, text: str, url: Optional[str] = None) -> Dict[str, Any]:
        raise NotImplementedError

class DeterministicDemoProvider(BaseAIProvider):
    """
    Pitch Demo Provider returning rich deterministic payloads.
    Always flags is_demo=True and provenance.mode='demo'.
    Does not substitute its curated evidence for arbitrary live user claims.
    """
    async def analyze_content(self, text: str = "", url: Optional[str] = None) -> Dict[str, Any]:
        payload = json.loads(json.dumps(DEMO_INVESTIGATION_PAYLOAD))
        payload["is_demo"] = True
        payload["mode"] = "demo"
        payload["provenance"] = {
            "mode": "demo",
            "evidence_status": "curated",
            "historical_status": "curated"
        }
        payload["status"] = "success"
        return payload

class LiveAIProvider(BaseAIProvider):
    """
    Live AI Provider using Gemini API with robust response validation.
    If the model fails, times out, or returns invalid data, returns a structured
    unavailable response instead of silently substituting demonstration evidence.
    """
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or ""

    def _is_valid_key(self) -> bool:
        if not self.api_key:
            return False
        key = self.api_key.strip().lower()
        invalid_prefixes = ("your-", "change-me", "example-", "placeholder", "xxxx", "test-key", "none", "null")
        if any(key.startswith(p) for p in invalid_prefixes) or len(key) < 8:
            return False
        return True

    def _validate_structure(self, parsed: Any, text: str) -> Optional[Dict[str, Any]]:
        """
        Strictly validates the parsed JSON response from the AI model.
        Returns the formatted payload if valid, or None if required fields are missing.
        """
        if not isinstance(parsed, dict):
            return None

        # Check required top-level structures
        required_top_keys = ["claim_summary", "trust_passport", "perspective_explorer", "narrative_memory", "ai_tutor"]
        if not all(k in parsed and isinstance(parsed[k], dict) for k in required_top_keys):
            return None

        tp = parsed["trust_passport"]
        if not isinstance(tp, dict):
            return None

        # Ensure minimal required passport fields
        if not tp.get("claim") or not tp.get("assessment"):
            return None

        # Ensure non-binary assessment code
        valid_codes = {"INSUFFICIENT_EVIDENCE", "CONTRADICTED", "CORROBORATED", "MIXED_EVIDENCE"}
        if tp.get("assessment_code") not in valid_codes:
            tp["assessment_code"] = "INSUFFICIENT_EVIDENCE"

        # Check narrative timeline presence
        timeline = parsed.get("narrative_memory", {}).get("timeline", [])
        has_timeline = isinstance(timeline, list) and len(timeline) > 0

        # Populate standard ATHENA metadata with structured provenance
        parsed["claim_id"] = f"live-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
        parsed["is_demo"] = False
        parsed["mode"] = "live"
        parsed["provenance"] = {
            "mode": "live",
            "evidence_status": "ai_assessed",
            "historical_status": "grounded" if has_timeline else "unavailable"
        }
        parsed["status"] = "success"
        parsed["input_text"] = text
        return parsed

    async def analyze_content(self, text: str, url: Optional[str] = None) -> Dict[str, Any]:
        if not self._is_valid_key():
            return build_unavailable_response(
                text=text,
                error_code="API_KEY_NOT_CONFIGURED",
                error_message="Live AI analysis is currently unavailable because a valid Gemini API key is not configured."
            )

        try:
            prompt = (
                "You are ATHENA, an epistemologically sound AI media literacy platform for UNESCO. "
                "Analyze the following text/claim without ever making binary true/false verdicts. "
                "Instead, evaluate evidence, context, and framing. "
                "Clearly separate observed facts from inferences. When uncertain, say so.\n\n"
                f"TEXT TO ANALYZE:\n{text}\n\n"
                "Return ONLY a valid JSON object matching this exact top-level structure:\n"
                "{\n"
                '  "claim_summary": {"primary_claim": "...", "sub_claims": [], "domain": "...", "virality_risk": "High|Medium|Low"},\n'
                '  "trust_passport": {\n'
                '    "claim": "...",\n'
                '    "source": {"origin": "...", "publisher": "...", "transparency_score": "High|Medium|Low"},\n'
                '    "evidence": {\n'
                '      "supporting_count": 0,\n'
                '      "conflicting_count": 0,\n'
                '      "unverified_count": 1,\n'
                '      "supporting_items": [],\n'
                '      "conflicting_items": [{"title": "...", "publisher": "...", "url": "", "verdict": "..."}],\n'
                '      "unverified_items": [{"title": "...", "publisher": "...", "url": "", "verdict": "..."}]\n'
                '    },\n'
                '    "context": {"missing_context": ["..."], "historical_precedent": "..."},\n'
                '    "language_analysis": {"sensationalism_score": 50, "loaded_words": [], "tone": "..."},\n'
                '    "assessment": "...",\n'
                '    "assessment_code": "INSUFFICIENT_EVIDENCE|CONTRADICTED|CORROBORATED|MIXED_EVIDENCE",\n'
                '    "confidence_level": "...",\n'
                '    "uncertainty_notes": "...",\n'
                '    "suggested_actions": ["..."]\n'
                '  },\n'
                '  "perspective_explorer": {"perspectives": [{"category": "...", "source_name": "...", "stance": "...", "summary": "...", "quote": "..."}], "common_ground": "...", "key_differences": "...", "remaining_uncertainties": "..."},\n'
                '  "narrative_memory": {"title": "...", "timeline": []},\n'
                '  "ai_tutor": {"explanation": {"core_concept": "...", "why_misleading": "...", "literacy_skills_taught": []}, "quiz": {"title": "...", "questions": [{"id": "q1", "question": "...", "options": ["A. ...", "B. ...", "C. ..."], "correct_option": 0, "explanation": "..."}]}}\n'
                "}\n"
                "STRICT RULES — violating these is not acceptable:\n"
                "1. assessment_code must be one of: INSUFFICIENT_EVIDENCE, CONTRADICTED, CORROBORATED, MIXED_EVIDENCE.\n"
                "2. All url fields must be empty strings (''). Never invent or guess any URLs.\n"
                "3. Never fabricate publication names, quotes, statistics, or dates not present in the input.\n"
                "4. narrative_memory.timeline must be empty ([]) unless verifiable chronological data exists in the input text.\n"
                "5. In assessment text, explicitly separate observed content (what the text states) from inferred patterns (what this typically signals).\n"
                "6. uncertainty_notes must describe what specifically cannot be verified — do not use generic boilerplate.\n"
                "7. suggested_actions must be actionable verification steps the user can take, not general advice.\n"
            )

            url_endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.post(
                    url_endpoint,
                    json={"contents": [{"parts": [{"text": prompt}]}]},
                    headers={"Content-Type": "application/json"}
                )
                if resp.status_code == 200:
                    res_json = resp.json()
                    candidates = res_json.get("candidates", [])
                    if candidates:
                        raw_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                        json_match = re.search(r"\{.*\}", raw_text, re.DOTALL)
                        if json_match:
                            parsed = json.loads(json_match.group(0))
                            validated = self._validate_structure(parsed, text)
                            if validated is not None:
                                return validated
                    return build_unavailable_response(
                        text=text,
                        error_code="MALFORMED_AI_RESPONSE",
                        error_message="ATHENA could not complete this analysis reliably (the model returned incomplete structured data)."
                    )
                else:
                    return build_unavailable_response(
                        text=text,
                        error_code=f"UPSTREAM_HTTP_{resp.status_code}",
                        error_message="ATHENA could not complete this analysis reliably (upstream AI service error)."
                    )
        except httpx.TimeoutException:
            return build_unavailable_response(
                text=text,
                error_code="UPSTREAM_TIMEOUT",
                error_message="ATHENA could not complete this analysis reliably (upstream AI service timed out)."
            )
        except Exception as e:
            return build_unavailable_response(
                text=text,
                error_code="ANALYSIS_EXCEPTION",
                error_message="ATHENA could not complete this analysis reliably."
            )

def get_ai_provider() -> BaseAIProvider:
    """Factory to return live AI provider configured with settings or env key."""
    try:
        from app.config import get_settings
        settings = get_settings()
        if settings.has_gemini:
            return LiveAIProvider(settings.GEMINI_API_KEY)
    except Exception:
        pass

    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY") or ""
    return LiveAIProvider(gemini_key)


# ───────────────────────────────────────────────
# CORE SERVICE FUNCTIONS
# ───────────────────────────────────────────────

async def run_investigation(text: str = "", url: Optional[str] = None, is_demo_mode: bool = False) -> Dict[str, Any]:
    """
    Run full end-to-end ATHENA investigation.
    - If is_demo_mode is True: returns the curated UNESCO pitch demonstration dataset.
    - If is_demo_mode is False: runs live AI analysis. If live AI is unavailable or fails,
      returns a structured analysis-unavailable response. Never silently substitutes demo evidence.
    """
    if is_demo_mode:
        provider = DeterministicDemoProvider()
    else:
        provider = get_ai_provider()

    result = await provider.analyze_content(text, url)
    result["timestamp"] = datetime.now(timezone.utc).isoformat()
    return result

