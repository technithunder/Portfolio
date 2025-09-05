FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY /* /app/

WORKDIR /app

RUN pip install --upgrade pip && pip install -r requirements.txt

EXPOSE 8000

CMD ["sh", "-c", "python manage.py collectstatic --noinput && \
       python manage.py makemigrations && \
       python manage.py migrate && \
       gunicorn Horizon.wsgi:application --bind 0.0.0.0:8000"]
