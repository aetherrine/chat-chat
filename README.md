> # Project Overview
This project builds a full-stack chat room application. 
## Technologies Used
- Frontend: React Typescript
- Backend: Django
- Protocol: RESTful API
- Database: PostgreSQL
- Infrastructure: Docker+Minikube
<br><br>

> # Installation
## 1. Activate Virtual Environment
```shell
python3 -m venv venv
source venv/bin/activate
```

## 2. Install Dependencies

To install packages
```shell
pip3 install -r requirements.txt 

# for Node.js and OpenSSL compatibility
export NODE_OPTIONS=--openssl-legacy-provider
```


## 3. Setup Database

Install and start PostgreSQL
```shell
# default username is current logged user name
# default password is `postgres`
brew install postgresql
brew services start postgresql

# create new database `chat`
psql -U {user_name} postgres
CREATE DATABASE chat;
```

Install psycopg2 (a PostgreSQL adapter for Python)
```shell
pip3 install psycopg2-binary
```

Modify the database setting in `rating_backend/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'chat',
        'USER':'admin',
        'PASSWORD':'postgres',
        "HOST": '127.0.0.1', # use 'postgres' for kubernetes
        "PORT": 5432,
    }
}
```

> # Run the programs
## Local Deployment
```shell
# start the backend service
# the backend endpoints will be available at http://127.0.0.1:8000/
python3 chat_backend/manage.py runserver

# start the frontend service
# the frontend webpage will open at http://localhost:3000/
cd chat_frontend
npm install
npm start
```

## Kubernetes Deployment (minikube)
```shell
minikube start
eval $(minikube docker-env)

# build docker images for server and client
docker build -t backend:latest -f dockerfile-backend .
docker build -t frontend:latest -f dockerfile-frontend .

# deploy 
kubectl apply -f deployment-postgres.yaml
kubectl apply -f deployment-backend.yaml
kubectl apply -f deployment-frontend.yaml

# verify deployment
kubectl get deployments

# verify service
kubectl get services

# check pod status
kubectl get pods -l app=django-backend
kubectl get pods -l app=react-frontend

# check logs
kubectl logs {pod_name}

# access the react frontend page
minikube service react-frontend --url

# delete resources
kubectl delete -f deployment-postgres.yaml
kubectl delete -f deployment-backend.yaml
kubectl delete -f deployment-frontend.yaml

minikube stop
minikube delete
```