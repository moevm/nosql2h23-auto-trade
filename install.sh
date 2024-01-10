#!/bin/sh

if [ "$1" = "dev" ]
then 
    docker compose -f docker-compose-dev.yml build --no-cache || docker-compose -f docker-compose-dev.yml build --no-cache
    chmod +x init_photos.sh
    ./init_photos.sh
else 
    docker compose build --no-cache || docker-compose build --no-cache
    chmod +x init_photos.sh
    ./init_photos.sh
fi
