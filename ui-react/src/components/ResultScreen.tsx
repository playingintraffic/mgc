import React, { useEffect } from 'react';
import { audioManager } from '@utils/audio';
import '../styles/ResultScreen.css';

interface ResultScreenProps {
  success: boolean;
  onClose?: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  success,
  onClose,
}) => {
  useEffect(() => {
    // Play appropriate sound
    audioManager.play(success ? 'succeeded' : 'system_fault', 0.5);

    // Auto-close after delay
    const timeout = setTimeout(() => {
      if (onClose) onClose();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [success, onClose]);

  return (
    <div className="minigame_result_screen">
      <div className={`result_icon ${success ? 'success' : 'failed'}`}>
        <i className={`fa-solid ${success ? 'fa-check' : 'fa-xmark'}`}></i>
      </div>
      <div className="result_text">{success ? 'SUCCESS' : 'FAILED'}</div>
    </div>
  );
};
