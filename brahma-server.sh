#!/bin/bash

echo ""

if [ "$1" == "-dev" ] || [ "$1" == "-d" ]; then
  echo "Starting Brahma in DEV Mode..."
  trap 'kill $BGPID; exit' INT
  trap 'docker stop brahma-mongo; exit' INT
  echo ""
  echo "Setting up Brahma ENV Variables..."
  export BRAHMA_URL=localhost
  export BRAHMA_PORT=3000
  echo ""
  echo "Creating MongoDB Container..."
  docker run --name brahma-mongo -d -p 27017:27017 -v /tmp/data:/data/db --rm mongo
  echo ""
  echo "Building Angular DIST in WATCH Mode (Background)..."
  ng serve &
  BGPID=$!
  echo ""
  echo "Starting Express Server (Foreground)..."
  node ./server/bin/www
elif [ "$1" == "-prod" ] || [ "$1" == "-p" ]; then
  echo "Starting Brahma in PROD Mode..."
  echo ""
  echo "Removing Brahma ENV Variables..."
  unset BRAHMA_URL
  unset BRAHMA_PORT
  echo ""
  echo "Building Angular DIST..."
  ng build --prod
  echo ""
  echo "Starting Express Server..."
  node ./server/bin/www
elif [ "$1" == "-build" ] || [ "$1" == "-b" ]; then
  echo "Building Angular DIST..."
  ng build --prod
  echo ""
  echo "Building Docker Container..."
  docker build -t brahma .
elif [ "$1" == "-compose" ] || [ "$1" == "-c" ]; then
  if [ "$2" == "-up" ] || [ "$2" == "-u" ]; then
    echo "Building Angular DIST..."
    ng build --prod
    echo ""
    echo "Starting Brahma Services..."
    docker-compose up --build &
  elif [ "$2" == "-down" ] || [ "$2" == "-d" ]; then
    echo "Stopping Brahma Services..."
    docker-compose down
  else
    echo "Missing arguments, please specify -up or -down."
    echo ""
  fi
else
  echo ""
  echo "Usage: brahma-server [-d] | [-p] | [-b] | [-c [-u|-d]]"
  echo ""
  echo "Brahma Server Script"
  echo ""
  echo "Optional Arguments:"
  echo "-d -dev       Run Server in Development Mode"
  echo "-p -prod      Run Server in Production Mode"
  echo "-b -build     Build Docker Container for Brahma Service"
  echo "-c -compose   Bring Full Brahma Service Up/Down via docker-compose"
  echo ""
  exit 0
fi
