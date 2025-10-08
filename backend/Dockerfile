FROM python:3.13.0-slim

EXPOSE 8000

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /backend

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

HEALTHCHECK CMD curl --fail http://localhost:8000/health || exit 1

# Dev
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# Prod
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]