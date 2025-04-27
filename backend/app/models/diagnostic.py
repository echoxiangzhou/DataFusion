from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Boolean, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.session import Base

class DiagnosticType(str, enum.Enum):
    """Enumeration of diagnostic types."""
    THERMOCLINE = "thermocline"
    HALOCLINE = "halocline"
    PYCNOCLINE = "pycnocline"
    SOUND_SPEED = "sound_speed"
    MESOSCALE_EDDY = "mesoscale_eddy"
    OCEAN_FRONT = "ocean_front"
    INTERNAL_WAVE = "internal_wave"

class JobStatus(str, enum.Enum):
    """Enumeration of job statuses."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class DiagnosticJob(Base):
    """Model for diagnostic jobs."""
    
    __tablename__ = "diagnostic_jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)
    
    # Job details
    diagnostic_type = Column(Enum(DiagnosticType), nullable=False)
    parameters = Column(JSON, nullable=False)
    status = Column(Enum(JobStatus), nullable=False, default=JobStatus.PENDING)
    result = Column(JSON, nullable=True)
    error_message = Column(String, nullable=True)
    
    # Relationships
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Tracking
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    dataset = relationship("Dataset", back_populates="diagnostic_jobs")
    user = relationship("User", back_populates="diagnostic_jobs")
    reports = relationship("Report", secondary="report_diagnostics", back_populates="diagnostics")

class Report(Base):
    """Model for generated reports."""
    
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)
    
    # Report details
    template_id = Column(Integer, ForeignKey("report_templates.id"), nullable=False)
    content = Column(String, nullable=True)
    status = Column(Enum(JobStatus), nullable=False, default=JobStatus.PENDING)
    
    # Relationships
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Tracking
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    template = relationship("ReportTemplate")
    user = relationship("User", back_populates="reports")
    diagnostics = relationship("DiagnosticJob", secondary="report_diagnostics", back_populates="reports")

class ReportTemplate(Base):
    """Model for report templates."""
    
    __tablename__ = "report_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)
    template_content = Column(String, nullable=False)
    
    # Tracking
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ReportDiagnostic(Base):
    """Association table between reports and diagnostic jobs."""
    
    __tablename__ = "report_diagnostics"
    
    report_id = Column(Integer, ForeignKey("reports.id"), primary_key=True)
    diagnostic_job_id = Column(Integer, ForeignKey("diagnostic_jobs.id"), primary_key=True)