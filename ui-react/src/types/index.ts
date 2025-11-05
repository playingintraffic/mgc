// Game types
export type GameName =
  | 'anagram'
  | 'tile_shift'
  | 'bit_flip'
  | 'circuit_trace'
  | 'whack_flash'
  | 'button_mash'
  | 'key_drop'
  | 'code_drop'
  | 'skill_bar'
  | 'skill_circle'
  | 'pulse_sync'
  | 'signal_wave'
  | 'chip_hack'
  | 'pattern_lock'
  | 'safe_crack'
  | 'pincode'
  | 'wire_cut'
  | 'packet_snatch'
  | 'frequency_jam'
  | 'hangman';

// Base game props interface
export interface BaseGameProps {
  data: GameData;
  onComplete: (success: boolean) => void;
}

// Game data interfaces
export interface GameData {
  game: GameName;
  [key: string]: any;
}

export interface SkillBarData extends GameData {
  icon?: string;
  orientation?: number;
  area_size?: number;
  perfect_area_size?: number;
  speed?: number;
  moving_icon?: boolean;
  icon_speed?: number;
}

export interface SkillCircleData extends GameData {
  icon?: string;
  perfect_area_size?: number;
  speed?: number;
}

export interface SafeCrackData extends GameData {
  difficulty?: number;
}

export interface AnagramData extends GameData {
  loading_time?: number;
  difficulty?: number;
  guesses?: number;
  timer?: number;
}

export interface ButtonMashData extends GameData {
  key?: string;
  timer?: number;
  fill_rate?: number;
}

export interface PatternLockData extends GameData {
  loading_time?: number;
  guesses?: number;
  timer?: number;
}

export interface WireCutData extends GameData {
  timer?: number;
}

export interface PincodeData extends GameData {
  length?: number;
  timer?: number;
}

export interface TileShiftData extends GameData {
  grid_size?: number;
  timer?: number;
}

export interface BitFlipData extends GameData {
  length?: number;
  loading_time?: number;
  guesses?: number;
  timer?: number;
}

export interface ChipHackData extends GameData {
  grid_size?: number;
  chips?: number;
  timer?: number;
}

export interface KeyDropData extends GameData {
  speed?: number;
  timer?: number;
}

export interface CodeDropData extends GameData {
  speed?: number;
  timer?: number;
  code_length?: number;
}

export interface WhackFlashData extends GameData {
  hits?: number;
  timer?: number;
}

export interface CircuitTraceData extends GameData {
  timer?: number;
}

export interface SignalWaveData extends GameData {
  difficulty?: number;
  timer?: number;
}

export interface PulseSyncData extends GameData {
  pulses?: number;
  timer?: number;
}

export interface PacketSnatchData extends GameData {
  speed?: number;
  timer?: number;
  packets?: number;
}

export interface FrequencyJamData extends GameData {
  dials?: number;
  timer?: number;
}

export interface HangmanData extends GameData {
  difficulty?: number;
  timer?: number;
}

// NUI Message types
export interface NUIMessage {
  action: string;
  game: GameName;
  data: GameData;
}

export interface GameResult {
  success: boolean;
  game: GameName;
}

// Audio types
export type SoundKey =
  | 'succeeded'
  | 'system_fault'
  | 'beep'
  | 'glitchy'
  | 'reinforced'
  | 'slick'
  | 'knob'
  | 'pull_back'
  | 'put_down'
  | 'small_tip'
  | 'safe_lock_1'
  | 'safe_lock_2'
  | 'safe_lock_3'
  | 'safe_lock_4'
  | 'safe_lock_5'
  | 'safe_lock_6';

export interface AudioManagerInterface {
  play: (key: SoundKey, volume?: number) => void;
  stop: (key: SoundKey) => void;
  stopAll: () => void;
}
