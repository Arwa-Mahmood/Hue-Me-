# Backend image for Railway (FastAPI: auth, profile, admin + Arwa's cv/ colour module).
# Built from the repo root so both backend/ and cv/ are included.
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app
COPY backend/requirements.txt backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend backend
COPY cv cv

WORKDIR /app/backend
# Railway sets PORT; 8000 when run locally
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
