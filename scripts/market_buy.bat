@echo off

echo.
echo ===============================
echo Sending BUY Order...
echo ===============================
echo.

curl.exe -X POST http://localhost:8080/order ^
-H "Content-Type: application/json" ^
-d "{\"symbol\":\"AAPL\",\"side\":\"BUY\",\"type\":\"MARKET\",\"quantity\":200,\"price\":0}"

echo.
echo.
pause
