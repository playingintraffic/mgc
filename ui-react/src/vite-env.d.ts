/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __DEV_MODE__: boolean;
