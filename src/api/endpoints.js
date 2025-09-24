// Central API definitions used by the app
import { get, post } from "./http";

// Hospitals
export function fetchHospitals({ lat, lon, symptom, severity } = {}) {
  // Expected backend GET /api/hospitals?lat=..&lon=..&symptom=..&severity=..
  return get("/api/hospitals", { query: { lat, lon, symptom, severity } });
}

// Feedback
export function sendHospitalFeedback(payload) {
  // Expected backend POST /api/feedback { hospital, address?, verdict: 'like'|'dislike' }
  return post("/api/feedback", payload);
}

// Speech-to-Text (optional placeholder)
export function speechToText(formData) {
  // Expected backend POST /api/speech-to-text (multipart/form-data)
  return fetch((import.meta.env.VITE_API_BASE_URL || "") + "/api/speech-to-text", {
    method: "POST",
    body: formData,
  }).then((r) => r.json());
}


// Location
export function sendLocation(payload) {
  // Expected backend POST /api/location { lat, lon }
  return post("/api/location", payload);
}


