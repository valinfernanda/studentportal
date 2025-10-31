# Studentportal

Dockerfile started via https://docs.docker.com/guides/nodejs/containerize/

## Requirements
You need a working Docker-compose or Podman-compose installation.

## How to run the first time
Docker
```
docker compose up --detach
```
Podman
```
podman compose up --detach
```

## Ho to run any time
Docker
```
docker compose up --detach --build --force-recreate
```
Podman
```
podman compose up --detach --build --force-recreate
```

## How to access
Just use http://localhost:3001 in your browser!
