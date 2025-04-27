from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.session import Base

class UserRole(str, enum.Enum):
    """Enumeration of user roles."""
    ADMIN = "admin"
    DATA_MANAGER = "data_manager"
    DATA_ANALYST = "data_analyst"
    VIEWER = "viewer"

class User(Base):
    """Model for system users."""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.VIEWER)
    
    # Tracking
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    diagnostic_jobs = relationship("DiagnosticJob", back_populates="user")
    reports = relationship("Report", back_populates="user")