import { LitElement } from 'lit';

import { Constructor } from '../types';

export declare class RxPlaySoundMixinInterface {
  public playSound(frequency: number, length: number): void;
}

export function RxPlaySoundMixin<TBase extends Constructor<LitElement>>(superClass: TBase) {
  class Mixin extends superClass {
    private audioContext = new AudioContext();

    /** @override */
    public disconnectedCallback() {
      this.audioContext.close();

      super.disconnectedCallback();
    }

    public playSound(frequency: number, length: number) {
      const { currentTime, destination } = this.audioContext;
      const gainNode = this.audioContext.createGain();
      const oscillator = this.audioContext.createOscillator();

      gainNode.connect(destination);
      oscillator.connect(gainNode).connect(destination);

      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(1, currentTime + length * 0.1);
      gainNode.gain.setValueAtTime(1, currentTime + length * 0.3);
      gainNode.gain.linearRampToValueAtTime(0, currentTime + length * 0.9);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, currentTime);
      oscillator.start();
      oscillator.stop(currentTime + length);
    }
  }

  return Mixin as Constructor<RxPlaySoundMixinInterface> & TBase;
}
