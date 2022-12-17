docker-compose stop
docker-compose down --volumes
docker system prune --all
docker-compose build
docker-compose up -d