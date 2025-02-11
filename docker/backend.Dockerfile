FROM golang:1.23.5-alpine

WORKDIR /app

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ .

RUN CGO_ENABLED=0 GOOS=linux go build -o /nicheflow-backend

CMD ["/nicheflow-backend"]
