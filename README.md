# 🎄 Advent of Code 2020 🎄

## Run server

Inside go subdirectory

#### With Docker

My server runs under port 80

```
docker build -t aocgo .
docker run -it -p 80:80 aocgo
```

serves under http://localhost

#### With Go

If you have go installed

```
go run .
```

serves under http://localhost:8080

## Deployment

I'm still figuring it out 😅 but want to write down what I learned and the next steps.

Basically I'm following this tutorial: https://docs.docker.com/engine/context/aci-integration/

ACI doesn't support port mapping so your server needs to serve on 80.

Note that those commands are doc for me, you won't be able to execute them because you have no rights on my Azure resources.

You need an Azure Container Registry and have "admin user" enabled (can also be done after creation)

Remember the URL of your registry (something.azurecr.io) and name your image accordingly during the build

```bash
docker context create aci azure
docker build -t apaulheim.azurecr.io/aoc20go .
az login
az acr login --name apaulheim
docker push apaulheim.azurecr.io/aoc20go
```

I was not able to run the image as ACI after building and pushing like in the tutorial. I went to the Azure Website and created an ACI with the wizard and selected the pushed image. Not sure how to update, still investigation needed on that. Will probably try a Docker compose file like this

```yaml
version: "3.7"
services:
  aocgo:
    domainname: aocgo
    image: apaulheim.azurecr.io/aoc20go:latest
    ports:
      - "80:80"
    expose:
      - 80
```

with

```bash
docker context use azure
docker compose up
docker compose down
```
