#!/bin/bash

echo "Starting local Docker containers..."
docker compose -f compose.local.yaml up -d --build

echo "Installing Composer dependencies..."
docker exec shipment_manager_local_app composer install

echo "Installing NPM dependencies..."
docker exec shipment_manager_local_app npm install

echo "Creating .env file if it does not exist..."
if [ ! -f .env ]; then
    cp .env.example .env
fi

echo "Generating Laravel app key..."
docker exec shipment_manager_local_app php artisan key:generate

echo "Running database migrations..."
docker exec shipment_manager_local_app php artisan migrate

echo "Seeding database with test users..."
docker exec shipment_manager_local_app php artisan db:seed

echo "Local setup finished."
echo "Open the app at: http://localhost:8000"
