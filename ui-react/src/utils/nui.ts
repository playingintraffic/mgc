import { GameResult } from '@/types';

// Check if running in FiveM NUI environment
export const isEnvBrowser = (): boolean => {
  return import.meta.env.MODE === 'development' && !window.location.href.includes('ui.html');
};

// Send message to Lua backend
export const fetchNui = async <T = any>(
  eventName: string,
  data?: any,
  mockData?: T
): Promise<T> => {
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  };

  if (isEnvBrowser()) {
    if (mockData) return mockData;
    return new Promise((resolve) => {
      setTimeout(() => resolve({} as T), 100);
    });
  }

  const resourceName = (window as any).GetParentResourceName
    ? (window as any).GetParentResourceName()
    : 'mgc';

  const resp = await fetch(`https://${resourceName}/${eventName}`, options);

  if (resp.ok) {
    return await resp.json();
  }

  return {} as T;
};

// Send game result to Lua
export const sendGameResult = (result: GameResult): void => {
  fetchNui('minigame_result', result);
};

// Clear focus (release mouse/keyboard)
export const clearFocus = (): void => {
  fetchNui('clear_focus');
};

// Debug: Log to console in dev mode
export const debugLog = (...args: any[]): void => {
  if (isEnvBrowser()) {
    console.log('[MGC DEBUG]', ...args);
  }
};
