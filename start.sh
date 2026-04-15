#!/bin/bash

# Backend
source .venv/bin/activate && uvicorn app.main:app --reload &

# Frontend
cd frontend && yarn run dev &

wait