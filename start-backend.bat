@echo off
echo.
echo ========================================
echo   🔮 Magical Wellness Challenge 🔮
echo ========================================
echo.
echo Starting backend server...
echo.

cd /d "%~dp0backend"

if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

echo Starting server with nodemon...
echo Server will be available at: http://localhost:3000
echo.
echo ✨ To test the app:
echo 1. Open frontend/index.html in your browser
echo 2. Or open frontend/test-dashboard.html to test functions
echo 3. Use test account: test@lol.com / 1234
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev