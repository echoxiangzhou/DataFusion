from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db

router = APIRouter(
    prefix="/thredds",
    tags=["thredds"],
    responses={404: {"description": "Not found"}},
)

@router.get("/servers")
async def get_thredds_servers(db: AsyncSession = Depends(get_db)):
    """
    Get a list of configured Thredds servers.
    """
    # Implementation to be added
    return {"servers": []}

@router.post("/servers")
async def add_thredds_server(
    # Request model to be added
    db: AsyncSession = Depends(get_db)
):
    """
    Add a new Thredds server configuration.
    """
    # Implementation to be added
    return {"id": "1", "status": "created"}

@router.get("/catalog")
async def get_thredds_catalog(
    server_id: str, 
    path: str = "",
    db: AsyncSession = Depends(get_db)
):
    """
    Get Thredds catalog for a specific server and path.
    """
    # Implementation to be added
    return {"catalog": []}