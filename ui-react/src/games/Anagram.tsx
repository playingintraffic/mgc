import React, { useEffect, useState } from 'react';
import { GameContainer } from '@components/GameContainer';
import { ResultScreen } from '@components/ResultScreen';
import { BaseGameProps, AnagramData } from '@/types';
import { useTimer } from '@hooks/useTimer';
import { useKeyPress } from '@hooks/useKeyPress';
import { getRandomWord, shuffleString } from '@utils/wordlists';
import '../styles/games/Anagram.css';

export const Anagram: React.FC<BaseGameProps> = ({ data, onComplete }) => {
  const gameData = data as AnagramData;
  const difficulty = gameData.difficulty || 1;
  const maxGuesses = gameData.guesses || 5;
  const timerDuration = gameData.timer || 30000;
  const loadingTime = gameData.loading_time || 5000;

  const [word, setWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [userInput, setUserInput] = useState('');
  const [guessesLeft, setGuessesLeft] = useState(maxGuesses);
  const [showResult, setShowResult] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gameActive, setGameActive] = useState(false);

  const { timeLeft } = useTimer({
    initialTime: timerDuration,
    autoStart: false,
    onExpire: () => {
      setGameSuccess(false);
      setShowResult(true);
      setTimeout(() => onComplete(false), 2000);
    },
  });

  useEffect(() => {
    const selectedWord = getRandomWord(difficulty);
    setWord(selectedWord.toUpperCase());
    setScrambled(shuffleString(selectedWord).toUpperCase());

    setTimeout(() => {
      setIsLoading(false);
      setGameActive(true);
    }, loadingTime);
  }, [difficulty, loadingTime]);

  const checkGuess = () => {
    if (userInput.toUpperCase() === word) {
      setGameSuccess(true);
      setShowResult(true);
      setGameActive(false);
      setTimeout(() => onComplete(true), 2000);
    } else {
      const newGuesses = guessesLeft - 1;
      setGuessesLeft(newGuesses);
      setUserInput('');

      if (newGuesses <= 0) {
        setGameSuccess(false);
        setShowResult(true);
        setGameActive(false);
        setTimeout(() => onComplete(false), 2000);
      }
    }
  };

  useKeyPress({
    onKeyDown: (e) => {
      if (!gameActive || showResult) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        if (userInput.length > 0) {
          checkGuess();
        }
      }
    },
    enabled: gameActive && !showResult,
  });

  if (showResult) {
    return <ResultScreen success={gameSuccess} />;
  }

  if (isLoading) {
    return (
      <GameContainer title="ANAGRAM" className="anagram-game">
        <div className="anagram_loading">
          <div className="loading_spinner"></div>
          <p>Preparing word...</p>
        </div>
      </GameContainer>
    );
  }

  return (
    <GameContainer title="ANAGRAM" timer={timeLeft} className="anagram-game">
      <div className="anagram_container">
        <div className="anagram_scrambled">{scrambled}</div>
        <div className="anagram_input_container">
          <input
            type="text"
            className="anagram_input"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your answer..."
            maxLength={word.length}
            autoFocus
          />
        </div>
        <div className="anagram_info">
          <span>Guesses left: {guessesLeft}</span>
          <span>Letters: {word.length}</span>
        </div>
        <button className="anagram_submit" onClick={checkGuess}>
          Submit
        </button>
      </div>
    </GameContainer>
  );
};
