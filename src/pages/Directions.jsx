"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Navigation, MapPin, Clock, Car, Bus, Footprints, ThumbsUp, ThumbsDown } from "lucide-react"
import { sendHospitalFeedback } from "../api/endpoints"

export default function Directions() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const hospital = searchParams.get("hospital") || ""
  const address = searchParams.get("address") || ""
  const [routeOptions, setRouteOptions] = useState([])
  const [selectedRoute, setSelectedRoute] = useState("car")
  const [feedback, setFeedback] = useState(null) // null, 'like', 'dislike'
  const [showFeedback, setShowFeedback] = useState(false)

  const goBack = () => {
    navigate(-1)
  }

  const startNavigation = () => {
    const encodedAddress = encodeURIComponent(address || hospital)
    window.open(`https://maps.google.com/maps?q=${encodedAddress}`, "_blank")
    // 길찾기 시작 후 피드백 섹션 표시
    setTimeout(() => {
      setShowFeedback(true)
    }, 2000) // 2초 후 피드백 섹션 표시
  }

  const handleFeedback = async (type) => {
    setFeedback(type)
    try {
      await sendHospitalFeedback({ hospital, address, verdict: type })
    } catch (e) {
      console.warn("피드백 전송 실패 (백엔드 준비 전이거나 오류)", e)
    }
    setTimeout(() => {
      navigate('/')
    }, 1500)
  }

  useEffect(() => {
    const mockRouteOptions = [
      {
        id: "car",
        type: "car",
        duration: "12분",
        distance: "3.2km",
        description: "가장 빠른 경로",
        icon: <Car className="route-icon" />,
      },
      {
        id: "bus",
        type: "transit",
        duration: "22분",
        distance: "4.5km",
        description: "버스 142번, 241번 이용",
        icon: <Bus className="route-icon" />,
      },
      {
        id: "walking",
        type: "walking",
        duration: "35분",
        distance: "2.8km",
        description: "도보 경로",
        icon: <Footprints className="route-icon" />,
      },
    ]
    setRouteOptions(mockRouteOptions)
  }, [])

  return (
    <div className="directions-container">
      {/* 헤더 */}
      <div className="header">
        <div className="header-content">
          <button onClick={goBack} className="back-button">
            <ArrowLeft className="back-icon" />
          </button>
          <h1 className="page-title">길찾기</h1>
          <div className="spacer" />
        </div>
      </div>

      {/* 목적지 정보 */}
      <div className="destination-info">
        <div className="destination-content">
          <MapPin className="location-icon" />
          <div>
            <h2 className="destination-name">{hospital}</h2>
            {address && <p className="destination-address">{address}</p>}
          </div>
        </div>
      </div>

      {/* 지도 영역 */}
      <div className="map-placeholder">
        <div className="map-content">
          <MapPin className="map-icon" />
          <p className="map-text">지도가 여기에 표시됩니다</p>
        </div>
      </div>

      {/* 경로 옵션 */}
      <div className="routes-section">
        <h3 className="routes-title">경로 선택</h3>
        <div className="routes-list">
          {routeOptions.map((option) => (
            <div key={option.id} className={`route-card ${selectedRoute === option.id ? "selected" : ""}`}>
              <button onClick={() => setSelectedRoute(option.id)} className="route-button">
                <div className="route-content">
                  <div className="route-info">
                    <div className={`route-icon-container ${selectedRoute === option.id ? "selected" : "unselected"}`}>
                      {option.icon}
                    </div>
                    <div>
                      <div className="route-details">
                        <span className="route-duration">{option.duration}</span>
                        <span className="route-distance">({option.distance})</span>
                      </div>
                      <p className="route-description">{option.description}</p>
                    </div>
                  </div>
                  <div className={`route-selector ${selectedRoute === option.id ? "selected" : "unselected"}`}></div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 네비게이션 시작 버튼 */}
      <div className="navigation-section">
        <button onClick={startNavigation} className="navigation-button">
          <Navigation className="nav-icon" />
          길찾기 시작
        </button>
      </div>

      {/* 추가 정보 */}
      <div className="additional-info">
        <div className="info-card-blue">
          <div className="info-header-blue">
            <Clock className="info-icon-blue" />
            <span className="info-title-blue">안내</span>
          </div>
          <p className="info-text-blue">
            실시간 교통상황에 따라 소요시간이 달라질 수 있습니다. 출발 전 병원 운영시간을 확인해 주세요.
          </p>
        </div>
      </div>

      {/* 피드백 섹션 */}
      {showFeedback && (
        <div className="feedback-section">
          <div className="feedback-card">
            <div className="feedback-header">
              <h3 className="feedback-title">서비스 만족도</h3>
              <p className="feedback-subtitle">
                추천해드린 병원이 도움이 되셨나요?
              </p>
            </div>
            
            <div className="feedback-buttons">
              <button 
                onClick={() => handleFeedback('like')}
                className={`feedback-button feedback-like ${feedback === 'like' ? 'selected' : ''}`}
                disabled={feedback !== null}
              >
                <ThumbsUp className="feedback-icon" />
                <span>좋아요</span>
              </button>
              
              <button 
                onClick={() => handleFeedback('dislike')}
                className={`feedback-button feedback-dislike ${feedback === 'dislike' ? 'selected' : ''}`}
                disabled={feedback !== null}
              >
                <ThumbsDown className="feedback-icon" />
                <span>싫어요</span>
              </button>
            </div>
            
            {feedback && (
              <div className="feedback-thanks">
                <p className="feedback-thanks-text">
                  {feedback === 'like' ? '👍 감사합니다!' : '피드백을 전달해드리겠습니다.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
