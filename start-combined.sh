#!/bin/bash

echo "Starting Next.js application..."
npm run start & # Start Next.js in the background

echo "Starting AI services..."
# Assuming AI directory is copied to /app/ai
# /app/ai/start_ai_service.sh & # Start AI services in the background

# Wait for all background processes to finish
wait