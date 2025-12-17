FROM python:3.12-slim

WORKDIR /app

# Install system dependencies if needed (none obvious from requirements, but gcc sometimes needed)
# RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Create venv and install requirements
# While venv is not strictly necessary in Docker, user asked for it. 
# But usually in Docker we install directly to system python or user python.
# I will follow standard docker python practice: install directly, unless user *strictly* insists on venv activation. 
# "in backend docker, set up venv and install reqs" -> OK, I will do it.
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

# Cloud Run defaults globally to 8080, passed via PORT env var.
# Uvicorn needs to listen on 0.0.0.0
CMD exec uvicorn main:app --host 0.0.0.0 --port $PORT
