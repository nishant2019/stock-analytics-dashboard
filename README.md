# Stock Analytics Dashboard

A production-ready, Dockerized React application building a sleek Stock Data Analytics Dashboard.

## Features
- Real-time market data visualization (Candlestick, Heatmap)
- Sleek dark theme using Ant Design and Tailwind CSS
- Technical indicators (RSI, MACD, etc.)
- Dockerized for easy deployment with Nginx

## Deployment
```bash
docker build -t stock-dashboard .
docker run -p 80:80 stock-dashboard
```
