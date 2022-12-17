# FROM python:3.9.7
# RUN mkdir /app/
# COPY . /app/api
# RUN pip install --upgrade pip && pip install -r /app/api/requirements.txt
# WORKDIR /app/api
# CMD ["supervisord", "-n", "-c","/app/api/supervisor/supervisord.conf"]

FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
