# Backend Deployment & Testing Guide

## Quick Start

### 1. Start the Backend Server

```bash
cd "project server"
docker-compose up -d
```

This starts:
- TimescaleDB (localhost:5432)
- ML API (localhost:8001)
- Data Processor (localhost:8000)

### 2. Verify Backend is Running

```bash
# Check all services are up
docker-compose ps

# Test data processor
curl http://localhost:8000/summary

# Test ML API
curl http://localhost:8001
```

### 3. Start the Mobile App

```bash
# From PulseAI_Build directory
npm start
```

## Testing the Integration

### Expected Behavior

**Dashboard Screen:**
- Shows real health data from `/summary` endpoint
- Updates every 5 seconds
- Falls back to mock data if backend is unavailable

**Trends Screen:**
- Shows last 30 days from `/summary/trends` endpoint
- Filter by time range works

**Alerts Screen:**
- Shows alerts generated from anomaly count
- Displays stress alerts if >20% stressed time

### Troubleshooting

**"Backend unavailable" warnings:**
1. Check backend is running: `docker-compose ps`
2. Verify port 8000 is accessible
3. Check logs: `docker logs data_processor`

**No data showing:**
- Backend needs historical data to show trends
- Run data ingestion to populate database
- Or use mock data temporarily by setting `USE_MOCK = true` in services

**Physical Device Testing:**
- Replace `localhost` with your machine's IP (e.g., `192.168.1.100`)
- Update `api.config.ts` BASE_URL

## Stop Backend

```bash
cd "project server"
docker-compose down
```

## Database Management

```bash
# Access database
docker exec -it timescaledb psql -U rushy -d readings

# View recent readings
SELECT * FROM smartwatch_readings ORDER BY time DESC LIMIT 10;

# View health summaries
SELECT * FROM health_summaries ORDER BY summary_date DESC;
```
