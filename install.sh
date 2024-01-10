#!/bin/sh

docker compose build --no-cache
chmod +x init_photos.sh
./init_photos.sh
