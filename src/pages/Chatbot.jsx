"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Mic, MicOff, ArrowLeft } from "lucide-react"
import Recorder from "recorder-js"

export default function Chatbot() {
  const navigate = useNavigate()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [audioUrl, setAudioUrl] = useState(null)
  const [error, setError] = useState(null)
  const recorderRef = useRef(null)
  const mediaStreamRef = useRef(null)

  // 병원 이름 추출
  const extractHospitalName = (utterance) => {
    if (!utterance) return null
    const normalized = utterance.replace(/"|'/g, "").trim()
    const nameMatch = normalized.match(/([가-힣A-Za-z0-9\s]*병원)/)
    if (nameMatch && nameMatch[1]) return nameMatch[1].trim()
    return null
  }

  // 의도별 라우팅
  const routeByIntent = (utterance) => {
    const hospitalName = extractHospitalName(utterance)
    if (hospitalName) {
      navigate(`/directions?hospital=${encodeURIComponent(hospitalName)}`)
      return
    }
    navigate(`/hospital-list?symptom=${encodeURIComponent(utterance)}`)
  }

  const goBack = () => {
    navigate(-1)
  }

  // 🎤 백엔드로 오디오 업로드
  const uploadAudio = async (audioBlob) => {
    const formData = new FormData()
    formData.append("file", audioBlob, "recording.wav") // ✅ 백엔드와 일치

    try {
      const response = await fetch("http://127.0.0.1:8000/stt/voice-to-keywords?method=gpt", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `HTTP 오류! 상태 코드: ${response.status}`)
      }

      const result = await response.json()
      console.log("업로드 성공:", result)

      if (result.result) {
        const text = result.original_text || ""
        setTranscript(text)
        routeByIntent(text)
      } else {
        setError("서버 응답에 변환된 텍스트가 없습니다.")
      }
    } catch (e) {
      console.error("업로드 실패:", e)
      setError(`오디오 파일을 서버로 보내는 데 실패했습니다: ${e.message}`)
    }
  }

  const startListening = async () => {
    try {
      setIsListening(true)
      setError(null)
      if (!navigator.mediaDevices?.getUserMedia) {
        setIsListening(false)
        setError("이 브라우저는 마이크 입력을 지원하지 않습니다.")
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream

      const recorder = new Recorder(stream, { numChannels: 1 }) // WAV (mono)
      await recorder.start()
      recorderRef.current = recorder
    } catch (e) {
      console.error(e)
      setIsListening(false)
      setError("녹음을 시작할 수 없습니다. 브라우저 권한을 확인해 주세요.")
    }
  }

  const stopListening = async () => {
    try {
      if (recorderRef.current) {
        const { blob } = await recorderRef.current.stop() // WAV Blob 반환
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)

        // 서버 업로드
        await uploadAudio(blob)
      }
    } catch (e) {
      console.error("녹음 종료/업로드 중 오류:", e)
      setError("녹음 종료 또는 파일 업로드 중 문제가 발생했습니다.")
    } finally {
      setIsListening(false)
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop())
        mediaStreamRef.current = null
      }
    }
  }

  useEffect(() => {
    return () => {
      try {
        if (recorderRef.current) {
          recorderRef.current.stop().catch(() => {})
        }
      } catch (_) {}
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop())
        mediaStreamRef.current = null
      }
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  return (
    <div className="chatbot-container">
      <div className="header">
        <div className="header-content">
          <button onClick={goBack} className="back-button">
            <ArrowLeft className="back-icon" />
          </button>
          <h1 className="page-title">음성 도우미</h1>
          <div className="spacer" />
        </div>
      </div>

      <div className="chatbot-main">
        <div className="chatbot-guide">
          <h2 className="chatbot-title">
            길찾기를 원하시는 병원이나
            <br />
            아픈 부위를 알려주세요
          </h2>
          <p className="chatbot-subtitle">음성으로 말씀해 주시면 도와드리겠습니다</p>
        </div>

        <div className="voice-control">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`voice-button-large ${isListening ? "voice-listening" : "voice-idle"}`}
            aria-label={isListening ? "음성 인식 중지" : "음성 인식 시작"}
          >
            {isListening ? <MicOff className="icon" /> : <Mic className="icon" />}
          </button>
          <p className="voice-status">
            {isListening ? "녹음 중입니다... 다시 누르면 종료됩니다" : "버튼을 눌러 녹음을 시작하세요"}
          </p>
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {audioUrl && (
          <div className="transcript-display">
            <audio controls src={audioUrl} style={{ width: "100%" }} />
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <a href={audioUrl} download={`recording_${Date.now()}.wav`} className="website-link">
                오디오 파일 다운로드
              </a>
            </div>
          </div>
        )}

        {transcript && (
          <div className="transcript-result">
            <p className="text-center mt-4 font-semibold">인식된 텍스트: {transcript}</p>
          </div>
        )}

        <div className="examples-section">
          <h3 className="examples-title">예시</h3>
          <div className="examples-list">
            <div className="example-item example-blue">
              <p>"서울대학교병원 가는 길 알려주세요"</p>
            </div>
            <div className="example-item example-green">
              <p>"머리가 많이 아파요"</p>
            </div>
            <div className="example-item example-purple">
              <p>"감기 증상이 조금 있어요"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
