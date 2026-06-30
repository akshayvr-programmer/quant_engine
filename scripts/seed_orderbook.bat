@echo off

echo.
echo ===============================
echo Seeding AAPL Order Book...
echo ===============================
echo.

curl.exe -X POST http://localhost:8080/seed ^
-H "Content-Type: application/json" ^
-d "{\"symbol\":\"AAPL\",\"side\":\"SELL\",\"type\":\"LIMIT\",\"quantity\":500,\"price\":100}"

echo.
echo.
pause
