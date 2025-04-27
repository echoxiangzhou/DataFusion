# Marine Environmental Data Integration and Diagnostic Product Software

This project aims to create a unified marine environmental data resource pool by integrating HDF and NetCDF data formats through Thredds data server and providing diagnostic capabilities for marine environmental phenomena.

## Features

- HDF and NetCDF data integration through Thredds
- Marine environmental phenomenon diagnostics:
  - Thermocline/halocline/pycnocline/sound speed analysis
  - Mesoscale eddy detection
  - Ocean front analysis
  - Internal wave statistical analysis
- Visualization of marine environmental data
- Report generation capabilities

## System Architecture

The system follows a modular, service-oriented architecture consisting of:

- Frontend application for user interface
- Backend services for data processing and business logic
- Thredds data server for HDF and NetCDF data access
- Data storage systems for metadata and diagnostic results
- Processing engines for computation-intensive operations

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL with PostGIS and TimescaleDB extensions
- Thredds Data Server 5.x with Java 11+ and Tomcat 9+
- Docker and Docker Compose (for development and deployment)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
# or if using Poetry
poetry install
```

### Frontend Setup

```bash
cd frontend
npm install
```

## Development

### Running the Backend

```bash
cd backend
python -m uvicorn app.main:app --reload
```

### Running the Frontend

```bash
cd frontend
npm run dev
```

## License

[Specify your license here]