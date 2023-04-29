FROM python:3.10
# ENV PYTHONDONTWRITEBYTECODE=1
# ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY requirements.txt /code
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6 libgl1 -y
RUN pip install -r requirements.txt
COPY . /code