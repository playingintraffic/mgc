import { useEffect, useCallback, useRef } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

interface UseKeyPressOptions {
  onKeyDown?: KeyHandler;
  onKeyUp?: KeyHandler;
  enabled?: boolean;
}

export const useKeyPress = ({
  onKeyDown,
  onKeyUp,
  enabled = true,
}: UseKeyPressOptions): void => {
  const handlersRef = useRef({ onKeyDown, onKeyUp });

  useEffect(() => {
    handlersRef.current = { onKeyDown, onKeyUp };
  }, [onKeyDown, onKeyUp]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (handlersRef.current.onKeyDown) {
      handlersRef.current.onKeyDown(event);
    }
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (handlersRef.current.onKeyUp) {
      handlersRef.current.onKeyUp(event);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    if (handlersRef.current.onKeyDown) {
      document.addEventListener('keydown', handleKeyDown);
    }
    if (handlersRef.current.onKeyUp) {
      document.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled, handleKeyDown, handleKeyUp]);
};
