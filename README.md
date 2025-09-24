# Frontend (React + Vite)

## Quick Start

1. Install
```
npm i
```
2. Configure env
Create a `.env` file in `frontend/` with:
```
VITE_API_BASE_URL=http://localhost:8000
```
3. Run
```
npm run dev
```

## API Integration

- Base URL is read from `VITE_API_BASE_URL`.
- API client lives in `src/api/http.js`.
- Endpoints are declared in `src/api/endpoints.js`.

### Expected backend routes
- `GET /api/hospitals?symptom=...&intensity=...` → returns an array of hospitals:
```
[
  { id, name, specialty, address, distance, rating, openHours, phone, website, isOpen }
]
```
- `POST /api/feedback` → body: `{ hospital, address, verdict: 'like'|'dislike' }`
- `POST /api/speech-to-text` (optional) → multipart/form-data with audio

## Pages that call the API
- `pages/HospitalList.jsx` → uses `fetchHospitals()`, gracefully falls back to mock data if API not ready
- `pages/Directions.jsx` → uses `sendHospitalFeedback()` when user presses like/dislike

## Notes
- If `VITE_API_BASE_URL` is empty, requests will be relative (same origin). This helps when proxying via dev server.
"# frontend" 
