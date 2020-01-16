#!/bin/bash

echo ""

if [ "$1" == "--dev" ]; then
  echo "Starting Brahma in DEV Mode..."
  trap 'kill $BGPID; exit' INT
  echo ""
  echo "Building Angular DIST in WATCH Mode (Background)..."
  ng build --prod --watch &
  BGPID=$!
  echo ""
  echo "Starting Express Server (Foreground)..."
  node ./server/bin/www
elif [ "$1" == "--prod" ]; then
  echo "Starting Brahma in PROD Mode..."
  echo ""
  echo "Building Angular DIST..."
  ng build --prod
  echo ""
  echo "Starting Express Server..."
  node ./server/bin/www
elif [ "$1" == "--build" ]; then
  echo "Building Angular DIST..."
  ng build --prod
  echo ""
  echo "Building Docker Container..."
  docker build -t brahma .
elif [ "$1" == "--compose" ]; then
  echo "Building Angular DIST..."
  ng build --prod
  echo ""
  echo "Building Docker Container..."
  docker-compose up &
else
  echo ""
  echo "Usage: brahma-server [--dev] | [--prod] | [--build]"
  echo ""
  echo "Brahma Server Script"
  echo ""
  echo "Optional Arguments:"
  echo "--dev       Run Server in Development Mode"
  echo "--prod      Run Server in Production Mode"
  echo "--build     Build Docker Container for Brahma Service"
  echo "--compose   Bring Full Brahma Service Online w/ docker-compose"
  echo ""
  exit 0
fi
