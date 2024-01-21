#!/bin/sh

if [ "$1" = "dev" ]
then 
    docker compose -f docker-compose-dev.yml up || docker-compose -f docker-compose-dev.yml up
elif [ "$1" = "git" ]
then 
    docker compose up -d || docker-compose up -d
else 
    docker compose up || docker-compose up
fi
