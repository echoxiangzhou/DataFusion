from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db

router = APIRouter(
    prefix="/datasets",
    tags=["datasets"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
async def get_datasets(db: AsyncSession = Depends(get_db)):
    """
    Get a list of available datasets.
    """
    # Implementation to be added
    return {"datasets": []}

@router.get("/{dataset_id}")
async def get_dataset(dataset_id: str, db: AsyncSession = Depends(get_db)):
    """
    Get details for a specific dataset.
    """
    # Implementation to be added
    return {"dataset_id": dataset_id, "name": "Example Dataset"}