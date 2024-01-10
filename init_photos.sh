#!/bin/sh

docker pull hello-world
docker volume create nosql2h23-auto-trade_vol_cars_photos
docker container create --name temp -v nosql2h23-auto-trade_vol_cars_photos:/_data hello-world
docker cp ./public/cars_photos/amggt.jpg temp:/_data
docker cp ./public/cars_photos/landcruiser.png temp:/_data
docker cp ./public/cars_photos/nophoto.jpg temp:/_data
docker cp ./public/cars_photos/sellBestCarEver.jpg temp:/_data
docker rm temp

# Файлы скопированы в volume vol_cars_photos
echo "Файлы скопированы в volume vol_cars_photos"