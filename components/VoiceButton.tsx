"use client";

import { useEffect, useCallback } from "react";
import { Button, Tooltip, message } from "antd";
import { AudioOutlined, AudioMutedOutlined } from "@ant-design/icons";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

export function VoiceButton() {
  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const [messageApi, contextHolder] = message.useMessage();

  // Função para enviar mensagem ao chat
  const sendToChat = useCallback((text: string) => {
    const textarea = document.querySelector('[class*="copilotKit"] textarea') as HTMLTextAreaElement;
    if (textarea) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      )?.set;
      
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(textarea, text);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        
        setTimeout(() => {
          const form = textarea.closest('form');
          if (form) {
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          } else {
            const sendButton = document.querySelector('[class*="copilotKit"] button[type="submit"], [class*="copilotKit"] button:has(svg)') as HTMLButtonElement;
            if (sendButton) {
              sendButton.click();
            }
          }
        }, 100);
      }
    }
  }, []);

  // Quando parar de escutar e tiver transcript, envia a mensagem
  useEffect(() => {
    if (!isListening && transcript.trim()) {
      sendToChat(transcript);
      messageApi.success("Mensagem enviada!");
      resetTranscript();
    }
  }, [isListening, transcript, resetTranscript, messageApi, sendToChat]);

  if (!isSupported) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isListening) {
      stopListening();
    } else {
      messageApi.info("Fale sua mensagem...");
      startListening();
    }
  };

  return (
    <>
      {contextHolder}
      <Tooltip title={isListening ? "Parar gravação" : "Falar mensagem"}>
        <Button
          type={isListening ? "primary" : "default"}
          danger={isListening}
          shape="circle"
          size="large"
          icon={isListening ? <AudioMutedOutlined /> : <AudioOutlined />}
          onClick={handleClick}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            bottom: 125,
            right: 10,
            zIndex: 1000,
            width: 56,
            height: 56,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            animation: isListening ? "pulse 1.5s infinite" : "none",
          }}
        />
      </Tooltip>
      
      {/* Indicador de transcrição */}
      {isListening && transcript && (
        <div
          style={{
            position: "fixed",
            bottom: 170,
            right: 24,
            zIndex: 1000,
            background: "#fff",
            padding: "12px 16px",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            maxWidth: 300,
            fontSize: 14,
          }}
        >
          <strong>Ouvindo:</strong> {transcript}
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(255, 77, 79, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 77, 79, 0);
          }
        }
      `}</style>
    </>
  );
}
