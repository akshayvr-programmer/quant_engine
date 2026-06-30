@echo off

echo ==========================
echo Seed Order Book
echo ==========================

curl.exe -X POST http://localhost:8080/seed ^
-H "Content-Type: application/json" ^
-d "{\"symbol\":\"AAPL\",\"side\":\"SELL\",\"type\":\"LIMIT\",\"quantity\":500,\"price\":100}"

echo.
echo.

echo ==========================
echo Buy Market Order
echo ==========================

curl.exe -X POST http://localhost:8080/order ^
-H "Content-Type: application/json" ^
-d "{\"symbol\":\"AAPL\",\"side\":\"BUY\",\"type\":\"MARKET\",\"quantity\":200,\"price\":0}"

echo.
echo.

echo ==========================
echo Account
echo ==========================

curl.exe http://localhost:8080/account

echo.
echo.

echo ==========================
echo Positions
echo ==========================

curl.exe http://localhost:8080/positions

echo.
echo.

echo ==========================
echo Trades
echo ==========================

curl.exe http://localhost:8080/trades

echo.
echo.

echo ==========================
echo Order Book
echo ==========================

curl.exe http://localhost:8080/book/AAPL

echo.
echo.
pause
