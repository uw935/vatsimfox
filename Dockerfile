FROM python:3.7.10

WORKDIR /build/

COPY requirements.txt /build/

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . /build/

# CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]