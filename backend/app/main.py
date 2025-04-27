from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession

# Import routers
from app.api.routes import datasets, thredds, diagnostics, reports, users

# Import database
from app.db.session import get_db

# Create FastAPI app
app = FastAPI(
    title="Marine Environmental Data Integration API",
    description="API for marine environmental data integration and diagnostics",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(datasets.router, prefix="/api/v1", tags=["datasets"])
app.include_router(thredds.router, prefix="/api/v1", tags=["thredds"])
app.include_router(diagnostics.router, prefix="/api/v1", tags=["diagnostics"])
app.include_router(reports.router, prefix="/api/v1", tags=["reports"])
app.include_router(users.router, prefix="/api/v1", tags=["users"])


@app.get("/api/v1/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """Health check endpoint"""
    return {"status": "healthy"}


@app.get("/")
async def root():
    """Root endpoint redirects to docs"""
    return {"message": "Marine Environmental Data Integration API. See /docs for API documentation."}