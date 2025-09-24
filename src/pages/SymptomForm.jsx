"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, ChevronDown } from "lucide-react"

const symptoms = [
  "감기/몸살",
  "소화불량/복통",
  "두통",
  "만성피로",
  "고혈압/당뇨",
  "허리통증",
  "어깨/목 통증",
  "무릎/관절 통증",
  "골절/타박상",
  "피부 트러블/알레르기",
  "비뇨기 문제",
  "코막힘/콧물/비염",
  "귀 통증/어지럼증",
  "눈 피로/시력 저하",
  "치아 통증/치과 검진",
  "임신/출산/부인과 검진",
  "소아/어린이 진료",
  "정신 건강/스트레스 상담",
  "한방 진료",
  "건강 검진",
]

const intensityLevels = ["조금 아픔", "아픔", "많이 아픔"]

export default function SymptomForm() {
  const [selectedSymptom, setSelectedSymptom] = useState(null)
  const [isSymptomDropdownOpen, setIsSymptomDropdownOpen] = useState(false)
  const [selectedIntensity, setSelectedIntensity] = useState(null)
  const [isIntensityDropdownOpen, setIsIntensityDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  const handleSubmit = () => {
    if (selectedSymptom && selectedIntensity) {
      navigate(
        `/hospital-list?symptom=${encodeURIComponent(selectedSymptom)}&intensity=${encodeURIComponent(selectedIntensity)}`,
      )
    }
  }

  return (
    <div className="symptom-container">
      {/* 헤더 */}
      <div className="header">
        <div className="header-content">
          <button onClick={handleBack} className="back-button" aria-label="뒤로가기">
            <ArrowLeft className="back-icon" />
          </button>
          <h1 className="page-title">증상 선택</h1>
          <div className="spacer" />
        </div>
      </div>

      <div className="symptom-content">
        {/* 증상 선택 카드 */}
        <div className="symptom-card">
          <div className="symptom-header">
            <div className="symptom-icon">
              <div className="symptom-icon-dot"></div>
            </div>
            <h2 className="symptom-card-title">증상 선택</h2>
          </div>

          <p className="symptom-description">지역별 특화 정보를 수집합니다</p>

          {/* 증상 드롭다운 */}
          <div className="form-group">
            <label className="form-label">아픈 곳을 선택해주세요</label>
            <div className="dropdown-container">
              <button onClick={() => setIsSymptomDropdownOpen(!isSymptomDropdownOpen)} className="dropdown-button">
                <span className={selectedSymptom ? "dropdown-text" : "dropdown-placeholder"}>
                  {selectedSymptom || "증상을 선택해주세요"}
                </span>
                <ChevronDown className={`dropdown-icon ${isSymptomDropdownOpen ? "open" : ""}`} />
              </button>

              {isSymptomDropdownOpen && (
                <div className="dropdown-menu">
                  {symptoms.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => {
                        setSelectedSymptom(symptom)
                        setIsSymptomDropdownOpen(false)
                      }}
                      className="dropdown-item"
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 증상 강도 드롭다운 */}
          <div className="form-group">
            <label className="form-label">아픔 정도가 어떠한가요?</label>
            <div className="dropdown-container">
              <button onClick={() => setIsIntensityDropdownOpen(!isIntensityDropdownOpen)} className="dropdown-button">
                <span className={selectedIntensity ? "dropdown-text" : "dropdown-placeholder"}>
                  {selectedIntensity || "강도를 선택해주세요"}
                </span>
                <ChevronDown className={`dropdown-icon ${isIntensityDropdownOpen ? "open" : ""}`} />
              </button>

              {isIntensityDropdownOpen && (
                <div className="dropdown-menu">
                  {intensityLevels.map((intensity) => (
                    <button
                      key={intensity}
                      onClick={() => {
                        setSelectedIntensity(intensity)
                        setIsIntensityDropdownOpen(false)
                      }}
                      className="dropdown-item"
                    >
                      {intensity}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={!selectedSymptom || !selectedIntensity}
          className={`submit-button ${selectedSymptom && selectedIntensity ? "enabled" : "disabled"}`}
        >
          병원 찾기
        </button>
      </div>
    </div>
  )
}
