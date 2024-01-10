#!/bin/sh

if [ "$1" = "dev" ]
then 
    docker compose -f docker-compose-dev.yml up || docker-compose -f docker-compose-dev.yml up
else 
    docker compose up || docker-compose up
fi
