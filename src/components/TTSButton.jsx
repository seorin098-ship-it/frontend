import React from 'react';

function speak(text) {
  try {
    if (!('speechSynthesis' in window)) {
      alert('이 브라우저는 TTS를 지원하지 않습니다.');
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ko-KR';
    utter.rate = 1;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  } catch (e) {
    console.error(e);
  }
}

function TTSButton({ text = '화면의 주요 내용을 읽어드립니다.' }) {
  return (
    <button
      type="button"
      className="tts-btn"
      onClick={() => speak(text)}
      aria-label="화면 읽기"
      title="화면 읽기"
    >
      🔊 화면 읽기
    </button>
  );
}

export default TTSButton;



