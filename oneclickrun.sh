#!/bin/bash

echo "Starting services"

if [ ! -f ".venv/bin/activate" ]; then
  echo "Creating venv..."
  python3 -m venv venv
fi

echo "Activating venv"
source .venv/bin/activate

if ! command -v uvicorn &> /dev/null; then
  echo "Installing backend deps..."
  pip install -r requirements.txt
fi

echo "Starting backend"
uvicorn app.main:app --reload &
BACK_PID=$!

echo "Starting frontend in Dev mode"
cd frontend || exit

npx yarn install
npx yarn dev &

FRONT_PID=$!

echo "Backend PID: $BACK_PID"
echo "Frontend PID: $FRONT_PID"

# Ждём оба процесса
wait $BACK_PID $FRONT_PIDchmod +x run.sh