FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Copy project files
COPY . .

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBUG=False

# Set up Django
RUN python backend/manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Run gunicorn
CMD ["gunicorn", "--chdir", "backend", "core.wsgi:application", "--bind", "0.0.0.0:8000"] 