FROM python:3.12-slim

WORKDIR /app

# Install system dependencies if needed (none obvious from requirements, but gcc sometimes needed)
# RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install dependencies directly to system python (no venv needed in container)
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

# Run uvicorn
# explicit host 0.0.0.0 and port $PORT are critical
CMD exec uvicorn main:app --host 0.0.0.0 --port $PORT
