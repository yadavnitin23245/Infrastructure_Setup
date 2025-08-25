
up:
	docker compose -f docker/dev/docker-compose.yml up -d
down:
	docker compose -f docker/dev/docker-compose.yml down -v
logs:
	docker compose -f docker/dev/docker-compose.yml logs -f
