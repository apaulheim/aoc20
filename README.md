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

## Continuous Deployment

![AOC workflow](https://github.com/apaulheim/aoc20/workflows/AOC_Workflow/badge.svg)

I'm still figuring it out 😅 but want to write down what I learned and the next steps.

I finally managed to set up a continous deployment with GitHub Actions, at least for the Go server. I followed this tutorial: https://docs.microsoft.com/de-de/azure/container-instances/container-instances-github-action

After every push to this repo, what is done in my workflow file is 

1. Authentication 
2. Build and push my Docker image to my Azure Container Registry. 
3. Restart my ACI

Now in the tutorial, on step 3 they create and start a new Azure Container Instance on EVERY run. That's not what I want, I just want to restart my existing ACI, which automatically checks out the newest image that I just pushed. I do that with some generic Azure CLI action GitHub provides: https://github.com/marketplace/actions/azure-cli-action

So now, maybe my py and ts Azure functions are next 😁 https://github.com/marketplace/actions/azure-functions-action
