import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';

const VoiceRecorder = ({ onTranscriptionReceived, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  console.log('VoiceRecorder rendered', { disabled, isRecording, isProcessing });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await sendAudioToWhisper(audioBlob);
        
        // ストリームを停止
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('音声録音の開始に失敗しました:', error);
      alert('マイクへのアクセスが許可されていません。ブラウザの設定を確認してください。');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const sendAudioToWhisper = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await fetch('/api/whisper', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Whisper API error details:', errorData);
        throw new Error(`音声認識に失敗しました: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (data.text) {
        onTranscriptionReceived(data.text);
      }
    } catch (error) {
      console.error('音声認識エラー:', error);
      alert('音声認識に失敗しました。もう一度お試しください。');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    if (disabled) return;
    
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isProcessing}
      className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
        disabled || isProcessing
          ? 'bg-gray-300 cursor-not-allowed'
          : isRecording
          ? 'bg-red-500 hover:bg-red-600 shadow-lg animate-pulse'
          : 'bg-gray-500 hover:bg-gray-600 shadow-md'
      }`}
      title={
        isProcessing
          ? '音声を処理中...'
          : isRecording
          ? '録音を停止'
          : '音声録音を開始'
      }
    >
      {isProcessing ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : isRecording ? (
        <Square size={16} className="text-white" />
      ) : (
        <Mic size={16} className="text-white" />
      )}
    </button>
  );
};

export default VoiceRecorder;