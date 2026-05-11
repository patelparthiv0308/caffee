@echo off
echo Starting Aether Caffee Project...

echo Starting Backend Server...
start cmd /k "cd backend\caffebackend && python manage.py runserver"

echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting up! You can close this window.
