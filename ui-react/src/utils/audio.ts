import { SoundKey, AudioManagerInterface } from '@/types';

class AudioManager implements AudioManagerInterface {
  private sounds: Map<SoundKey, HTMLAudioElement> = new Map();
  private basePath = './assets/audio/';

  private soundFiles: Record<SoundKey, string> = {
    succeeded: 'succeeded.ogg',
    system_fault: 'system_fault.ogg',
    beep: 'beep.ogg',
    glitchy: 'glitchy.ogg',
    reinforced: 'reinforced.ogg',
    slick: 'slick.ogg',
    knob: 'knob.ogg',
    pull_back: 'pull_back.ogg',
    put_down: 'put_down.ogg',
    small_tip: 'small_tip.ogg',
    safe_lock_1: 'safe_lock_1.mp3',
    safe_lock_2: 'safe_lock_2.mp3',
    safe_lock_3: 'safe_lock_3.mp3',
    safe_lock_4: 'safe_lock_4.mp3',
    safe_lock_5: 'safe_lock_5.mp3',
    safe_lock_6: 'safe_lock_6.mp3',
  };

  constructor() {
    this.preloadSounds();
  }

  private preloadSounds(): void {
    Object.entries(this.soundFiles).forEach(([key, file]) => {
      const audio = new Audio(`${this.basePath}${file}`);
      audio.preload = 'auto';
      this.sounds.set(key as SoundKey, audio);
    });
  }

  public play(key: SoundKey, volume: number = 0.3): void {
    const sound = this.sounds.get(key);
    if (sound) {
      sound.volume = volume;
      sound.currentTime = 0;
      sound.play().catch((err) => {
        console.warn(`Failed to play sound: ${key}`, err);
      });
    }
  }

  public stop(key: SoundKey): void {
    const sound = this.sounds.get(key);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  public stopAll(): void {
    this.sounds.forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
  }
}

export const audioManager = new AudioManager();
