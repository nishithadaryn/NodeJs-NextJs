# Run backend without Docker
run:
	node backend/server.js

# Run backend in development mode with auto-reload
dev:
	nodemon backend/server.js

# Lint using ESLint
lint:
	npx eslint backend --ext .js,.ts

# Run tests using Jest
test:
	npx jest backend

# Run backend with Docker Compose
docker-up:
	docker compose up --build

# Stop Docker Compose
docker-down:
	docker compose down
