FROM focker.ir/python:3.9.6
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

ENV RUN_DIR=/backend-aaiss
RUN mkdir -p $RUN_DIR $RUN_DIR/media
WORKDIR $RUN_DIR

COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

EXPOSE 6446
CMD gunicorn aaiss_backend.wsgi:application --bind 0.0.0.0:6446