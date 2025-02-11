.PHONY: run-dev build-docker

run-dev: 
    @echo "启动全栈开发环境..."
    cd backend && air &
    cd frontend && pnpm dev

build-docker:
    docker-compose build
