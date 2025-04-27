from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base

class Dataset(Base):
    """Model for marine environmental datasets."""
    
    __tablename__ = "datasets"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)
    file_path = Column(String, nullable=False)
    file_format = Column(String, nullable=False)  # HDF, NetCDF, etc.
    
    # Connection to Thredds server
    thredds_server_id = Column(Integer, ForeignKey("thredds_servers.id"), nullable=True)
    thredds_url = Column(String, nullable=True)
    
    # Metadata
    variables = Column(JSON, nullable=True)
    dimensions = Column(JSON, nullable=True)
    spatial_coverage = Column(JSON, nullable=True)  # {"min_lat": x, "max_lat": y, "min_lon": x, "max_lon": y}
    temporal_coverage = Column(JSON, nullable=True)  # {"start": "ISO_timestamp", "end": "ISO_timestamp"}
    
    # Tracking
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # Relationships
    thredds_server = relationship("ThreddsServer", back_populates="datasets")
    diagnostic_jobs = relationship("DiagnosticJob", back_populates="dataset")


class ThreddsServer(Base):
    """Model for Thredds server configurations."""
    
    __tablename__ = "thredds_servers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    base_url = Column(String, nullable=False)
    username = Column(String, nullable=True)
    password = Column(String, nullable=True)
    description = Column(String, nullable=True)
    
    # Tracking
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # Relationships
    datasets = relationship("Dataset", back_populates="thredds_server")