import React, { useEffect, useState } from 'react';
import { GameContainer } from '@components/GameContainer';
import { ResultScreen } from '@components/ResultScreen';
import { BaseGameProps, PincodeData } from '@/types';
import { useTimer } from '@hooks/useTimer';
import '../styles/games/Pincode.css';

export const Pincode: React.FC<BaseGameProps> = ({ data, onComplete }) => {
  const gameData = data as PincodeData;
  const codeLength = gameData.length || 4;
  const timerDuration = gameData.timer || 15000;

  const [code, setCode] = useState('');
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);

  const { timeLeft } = useTimer({
    initialTime: timerDuration,
    autoStart: true,
    onExpire: () => {
      setGameSuccess(false);
      setShowResult(true);
      setTimeout(() => onComplete(false), 2000);
    },
  });

  useEffect(() => {
    let generatedCode = '';
    for (let i = 0; i < codeLength; i++) {
      generatedCode += Math.floor(Math.random() * 10);
    }
    setCode(generatedCode);
  }, [codeLength]);

  const handleNumberClick = (num: number) => {
    if (userInput.length < codeLength && !showResult) {
      const newInput = userInput + num;
      setUserInput(newInput);

      if (newInput.length === codeLength) {
        setTimeout(() => {
          if (newInput === code) {
            setGameSuccess(true);
            setShowResult(true);
            setTimeout(() => onComplete(true), 2000);
          } else {
            setGameSuccess(false);
            setShowResult(true);
            setTimeout(() => onComplete(false), 2000);
          }
        }, 300);
      }
    }
  };

  const handleClear = () => {
    if (!showResult) {
      setUserInput('');
    }
  };

  if (showResult) {
    return <ResultScreen success={gameSuccess} />;
  }

  return (
    <GameContainer title="PINCODE" timer={timeLeft} className="pincode-game">
      <div className="pincode_container">
        <div className="pincode_display_container">
          <div className="pincode_target">
            <span>Target Code:</span>
            <div className="code_display">{code}</div>
          </div>
          <div className="pincode_input">
            <span>Your Input:</span>
            <div className="code_display">
              {userInput.padEnd(codeLength, '_').split('').map((char, idx) => (
                <span key={idx} className={char !== '_' ? 'filled' : ''}>
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="pincode_keypad">
          <div className="keypad_row">
            {[1, 2, 3].map((num) => (
              <button key={num} onClick={() => handleNumberClick(num)}>
                {num}
              </button>
            ))}
          </div>
          <div className="keypad_row">
            {[4, 5, 6].map((num) => (
              <button key={num} onClick={() => handleNumberClick(num)}>
                {num}
              </button>
            ))}
          </div>
          <div className="keypad_row">
            {[7, 8, 9].map((num) => (
              <button key={num} onClick={() => handleNumberClick(num)}>
                {num}
              </button>
            ))}
          </div>
          <div className="keypad_row">
            <button onClick={handleClear}>CLR</button>
            <button onClick={() => handleNumberClick(0)}>0</button>
            <button disabled style={{ opacity: 0.3 }}>OK</button>
          </div>
        </div>
      </div>
    </GameContainer>
  );
};
