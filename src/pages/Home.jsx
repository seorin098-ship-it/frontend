import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { sendLocation } from "../api/endpoints"
import { Mic, CheckSquare } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)

  const getLocation = () => {
    setError(null)
    setLocation(null)

    const isSecureContext = window.isSecureContext || window.location.protocol === "https:" || window.location.hostname === "localhost"
    if (!isSecureContext) {
      setError("HTTPS(또는 localhost)에서만 위치를 가져올 수 있습니다. 개발 서버로 실행해 주세요.")
      return
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lon = position.coords.longitude
          setLocation(`위도: ${lat}, 경도: ${lon}`)
          setError(null)
          try {
            // 비동기 전송: 실패해도 UI는 유지
            sendLocation({ lat, lon }).catch(() => {})
          } catch (_) {}
        },
        (err) => {
          if (err && typeof err.code === "number") {
            if (err.code === 1) {
              setError("위치 권한이 차단되어 있습니다. 주소창의 자물쇠▶사이트 권한에서 '위치'를 허용해 주세요.")
            } else if (err.code === 2) {
              setError("위치 정보를 가져올 수 없습니다. 잠시 후 다시 시도해 주세요.")
            } else if (err.code === 3) {
              setError("위치 요청이 시간 초과되었습니다. 다시 시도해 주세요.")
            } else {
              setError("위치를 찾을 수 없습니다.")
            }
          } else {
            setError("위치를 찾을 수 없습니다.")
          }
          setLocation(null)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    } else {
      setError("Geolocation을 지원하지 않는 브라우저입니다.")
      setLocation(null)
    }
  }

  const handleVoiceButtonClick = () => {
    navigate("/chatbot")
  }

  const handleCheckButtonClick = () => {
    navigate("/symptom-form")
  }

  return (
    <div className="home-container">
      <div>
        <h1 className="home-title">맞춤 병원 & 쉬운 길</h1>
      </div>

      <div className="location-group">
        <button onClick={getLocation} className="location-button" aria-label="현재 위치 찾기">
          현재 위치 찾기
        </button>
        <p className="location-message">{location || error}</p>
      </div>

      <div className="button-container">
        <div>
          <button
            onClick={handleVoiceButtonClick}
            className="voice-button"
            aria-label="음성 녹음 시작"
          >
            <Mic className="icon" />
          </button>
          <p className="button-text">말씀해 주세요</p>
        </div>

        <div>
          <button
            onClick={handleCheckButtonClick}
            className="check-button"
            aria-label="체크 기능"
          >
            <CheckSquare className="icon" />
          </button>
          <p className="button-text">화면에서 선택</p>
        </div>
      </div>
    </div>
  )
}