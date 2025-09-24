"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, MapPin, Clock, Star, Phone, Globe } from "lucide-react"
import { fetchHospitals } from "../api/endpoints"

export default function HospitalList() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const symptom = searchParams.get("symptom") || ""
  const severity = searchParams.get("severity") || ""
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [coords, setCoords] = useState({ lat: null, lon: null })

  const goBack = () => {
    navigate(-1)
  }

  const selectHospital = (hospital) => {
    navigate(
      `/directions?hospital=${encodeURIComponent(hospital.name)}&address=${encodeURIComponent(hospital.address)}`,
    )
  }

  // 사용자 위치 요청 (lat, lon)
  useEffect(() => {
    let cancelled = false
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (cancelled) return
          const { latitude, longitude } = pos.coords || {}
          setCoords({ lat: latitude ?? null, lon: longitude ?? null })
        },
        () => {
          if (cancelled) return
          setCoords((prev) => ({ lat: prev.lat, lon: prev.lon }))
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 },
      )
    }
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      setLoading(true)
      setError("")
      try {
        const data = await fetchHospitals({ lat: coords.lat, lon: coords.lon, symptom, severity })
        if (isMounted && Array.isArray(data)) {
          const mapped = data.map((item, idx) => {
            const name = item?.["요양기관명"] ?? item?.name ?? "알 수 없는 병원"
            const address = item?.["주소"] ?? item?.address ?? "주소 정보 없음"
            const phone = item?.["전화번호"] ?? item?.phone ?? null
            const website = item?.["병원홈페이지"] ?? item?.website ?? null
            const distanceKm = item?.distance_km
            const predictedRating = item?.predicted_rating
            return {
              id: item?.id ?? `${name}-${idx}`,
              name,
              address,
              phone: phone,
              website: website,
              distance: typeof distanceKm === "number" ? `${distanceKm.toFixed(1)}km` : distanceKm ?? undefined,
              rating: typeof predictedRating === "number" ? predictedRating.toFixed(1) : predictedRating ?? undefined,
              // optional fields (may be undefined)
              specialty: item?.specialty,
              openHours: item?.openHours,
              isOpen: item?.isOpen,
            }
          })
          setHospitals(mapped)
          return
        }
      } catch (e) {
        console.warn("병원 API 호출 실패, 목업 데이터 사용", e)
        setError("병원 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.")
      }

      // Fallback mock when API not ready
      const mockHospitals = [
        { id: "1", name: "서울신경과의원", specialty: "신경과", address: "서울시 강남구 테헤란로 123", distance: "0.5km", rating: 4.8, openHours: "09:00 - 18:00", phone: "02-1234-5678", website: "https://seoulneuro.co.kr", isOpen: true },
        { id: "2", name: "브레인클리닉", specialty: "신경외과", address: "서울시 서초구 서초대로 456", distance: "1.2km", rating: 4.6, openHours: "08:30 - 17:30", phone: "02-2345-6789", website: "https://brainclinic.kr", isOpen: true },
        { id: "3", name: "우리가정의학과", specialty: "가정의학과", address: "서울시 강남구 역삼로 789", distance: "0.3km", rating: 4.7, openHours: "09:00 - 19:00", phone: "02-3456-7890", website: "https://ourfamily.co.kr", isOpen: true },
        { id: "4", name: "강남내과의원", specialty: "내과", address: "서울시 강남구 선릉로 321", distance: "0.8km", rating: 4.5, openHours: "09:30 - 18:30", phone: "02-4567-8901", website: "https://gangnaminternal.co.kr", isOpen: true },
        { id: "5", name: "서울정형외과", specialty: "정형외과", address: "서울시 강남구 도곡로 654", distance: "1.5km", rating: 4.9, openHours: "08:00 - 17:00", phone: "02-5678-9012", website: "https://seoulortho.kr", isOpen: true },
      ]
      if (isMounted) setHospitals(mockHospitals)
      setLoading(false)
    })()
    return () => {
      isMounted = false
    }
  }, [symptom, severity, coords.lat, coords.lon])

  return (
    <div className="hospital-container">
      {/* 헤더 */}
      <div className="hospital-header">
        <div className="header-content">
          <button onClick={goBack} className="back-button">
            <ArrowLeft className="back-icon" />
          </button>
          <h1 className="page-title">병원 추천</h1>
          <div className="spacer" />
        </div>

        {/* 증상 표시 */}
        <div className="symptom-display">
          <div className="symptom-badge">
            <p className="symptom-text">
              <span style={{ fontWeight: "bold" }}>증상:</span> "{symptom}"
            </p>
          </div>
        </div>
      </div>

      {/* 로딩/에러 */}
      {loading ? (
        <div className="info-section"><div className="info-card"><p className="info-text">불러오는 중...</p></div></div>
      ) : null}
      {error ? (
        <div className="info-section"><div className="info-card"><p className="info-text">{error}</p></div></div>
      ) : null}

      {/* 병원 리스트 */}
      <div className="hospital-list">
        {hospitals.map((hospital) => (
          <div key={hospital.id} className="hospital-card">
            <button onClick={() => selectHospital(hospital)} className="hospital-button">
              <div className="hospital-header-info">
                <div>
                  <h3 className="hospital-name">{hospital.name}</h3>
                  {hospital?.specialty ? (
                    <p className="hospital-specialty">{hospital.specialty}</p>
                  ) : null}
                </div>
                <div className="hospital-rating">
                  <Star className="star-icon" />
                  <span className="rating-text">{hospital?.rating ?? "-"}</span>
                </div>
              </div>

              <div className="hospital-details">
                <div className="hospital-detail">
                  <MapPin className="detail-icon" />
                  <span>{hospital.address}</span>
                  {hospital?.distance ? (
                    <span className="distance-text">{hospital.distance}</span>
                  ) : null}
                </div>

                {hospital?.openHours || typeof hospital?.isOpen === "boolean" ? (
                  <div className="hospital-detail">
                    <Clock className="detail-icon" />
                    <span>{hospital?.openHours ?? "-"}</span>
                    {typeof hospital?.isOpen === "boolean" ? (
                      <span className={`status-badge ${hospital.isOpen ? "status-open" : "status-closed"}`}>
                        {hospital.isOpen ? "진료중" : "진료종료"}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <div className="hospital-detail">
                  <Phone className="detail-icon" />
                  <span>{hospital?.phone ?? "전화번호 정보 없음"}</span>
                </div>

                {hospital?.website ? (
                  <div className="hospital-detail">
                    <Globe className="detail-icon" />
                    <a 
                      href={hospital.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="website-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {hospital.website}
                    </a>
                  </div>
                ) : null}
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* 안내 메시지 */}
      <div className="info-section">
        <div className="info-card">
          <p className="info-text">병원을 선택하시면 길찾기 화면으로 이동합니다.</p>
        </div>
      </div>
    </div>
  )
}
