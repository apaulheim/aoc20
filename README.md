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
