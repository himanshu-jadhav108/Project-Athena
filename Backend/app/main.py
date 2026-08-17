from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import get_settings
from app.routers import claims, bias, source, quiz, auth, forensics, investigate
from app.utils.rate_limiter import rate_limit_check
import time

settings = get_settings()

app = FastAPI(
    title="ATHENA API",
    description="AI-Powered Media Literacy Platform — Multi-source claim verification, bias detection, source scoring, media literacy training, image forensics, and investigation workspace.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — include production Vercel URL and cover all Vercel preview deployments
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")] if settings.CORS_ORIGINS else ["*"]
if "http://localhost:3000" not in origins:
    origins.append("http://localhost:3000")
if "http://127.0.0.1:3000" not in origins:
    origins.append("http://127.0.0.1:3000")
# Always include the known production Vercel URL
if "https://athena-eta-flame.vercel.app" not in origins:
    origins.append("https://athena-eta-flame.vercel.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # Also allow localhost variants and all Vercel preview/branch deployments
    allow_origin_regex=r"(http://(localhost|127\.0\.0\.1)(:\d+)?|https://athena-eta-flame(-[a-z0-9]+)?\.vercel\.app)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred while processing the request.", "path": request.url.path}
    )

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Rate limiting middleware
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    path = request.url.path

    if path.startswith("/claims/analyze"):
        try:
            await rate_limit_check(request, key_prefix="claims", max_requests=10, window_seconds=60)
        except Exception as e:
            return JSONResponse(status_code=429, content={"detail": str(e)})
    elif path.startswith("/forensics/analyze"):
        try:
            await rate_limit_check(request, key_prefix="forensics", max_requests=5, window_seconds=60)
        except Exception as e:
            return JSONResponse(status_code=429, content={"detail": str(e)})
    elif path.startswith("/bias/detect"):
        try:
            await rate_limit_check(request, key_prefix="bias", max_requests=15, window_seconds=60)
        except Exception as e:
            return JSONResponse(status_code=429, content={"detail": str(e)})

    response = await call_next(request)
    return response

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ATHENA API",
        "version": "2.0.0",
        "modules": [
            "investigation_workspace",
            "trust_passport",
            "perspective_explorer",
            "narrative_memory",
            "ai_tutor",
            "claim_checker",
            "bias_detector",
            "source_scorer",
            "media_trainer",
            "image_forensics",
            "auth"
        ]
    }

@app.get("/")
async def root():
    return {
        "name": "ATHENA API",
        "description": "AI-Powered Media Literacy Platform",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "investigate": "/investigate",
            "auth": "/auth",
            "claims": "/claims",
            "bias": "/bias",
            "source": "/source",
            "quiz": "/quiz",
            "forensics": "/forensics"
        }
    }

# Include all routers
app.include_router(investigate.router)
app.include_router(auth.router)
app.include_router(claims.router)
app.include_router(bias.router)
app.include_router(source.router)
app.include_router(quiz.router)
app.include_router(forensics.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
