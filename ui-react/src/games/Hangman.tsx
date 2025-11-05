import React, { useEffect, useState } from 'react';
import { GameContainer } from '@components/GameContainer';
import { ResultScreen } from '@components/ResultScreen';
import { BaseGameProps, HangmanData } from '@/types';
import { useTimer } from '@hooks/useTimer';
import { useKeyPress } from '@hooks/useKeyPress';
import { getRandomWord } from '@utils/wordlists';
import '../styles/games/Hangman.css';

export const Hangman: React.FC<BaseGameProps> = ({ data, onComplete }) => {
  const gameData = data as HangmanData;
  const difficulty = gameData.difficulty || 1;
  const timerDuration = gameData.timer || 45000;

  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const maxWrongGuesses = 6;
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
    const selectedWord = getRandomWord(difficulty).toUpperCase();
    setWord(selectedWord);
  }, [difficulty]);

  const handleGuess = (letter: string) => {
    if (guessedLetters.has(letter) || showResult) return;

    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    if (!word.includes(letter)) {
      const newWrong = wrongGuesses + 1;
      setWrongGuesses(newWrong);

      if (newWrong >= maxWrongGuesses) {
        setGameSuccess(false);
        setShowResult(true);
        setTimeout(() => onComplete(false), 2000);
      }
    } else {
      // Check if word is complete
      const isComplete = word.split('').every((char) => newGuessed.has(char));
      if (isComplete) {
        setGameSuccess(true);
        setShowResult(true);
        setTimeout(() => onComplete(true), 2000);
      }
    }
  };

  useKeyPress({
    onKeyDown: (e) => {
      const letter = e.key.toUpperCase();
      if (letter.length === 1 && letter.match(/[A-Z]/)) {
        handleGuess(letter);
      }
    },
    enabled: !showResult,
  });

  const displayWord = word
    .split('')
    .map((char) => (guessedLetters.has(char) ? char : '_'))
    .join(' ');

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  if (showResult) {
    return <ResultScreen success={gameSuccess} />;
  }

  return (
    <GameContainer title="HANGMAN" timer={timeLeft} className="hangman-game">
      <div className="hangman_container">
        <div className="hangman_display">
          <div className="hangman_word">{displayWord}</div>
          <div className="hangman_info">
            Wrong guesses: {wrongGuesses} / {maxWrongGuesses}
          </div>
        </div>
        <div className="hangman_keyboard">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.has(letter)}
              className={guessedLetters.has(letter) ? 'used' : ''}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
    </GameContainer>
  );
};
