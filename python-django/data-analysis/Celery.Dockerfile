FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY /* /app/

WORKDIR /app

RUN pip install --upgrade pip && pip install -r requirements.txt


CMD ["celery", "-A", "Horizon", "worker", "--loglevel=info"]
