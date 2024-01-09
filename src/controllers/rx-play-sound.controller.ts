import { ReactiveController, ReactiveControllerHost } from 'lit';

export class RxPlaySoundController implements ReactiveController {
  private host: ReactiveControllerHost;

  private audioContext = new AudioContext();

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    this.host.addController(this);
  }

  hostDisconnected() {
    this.audioContext.close();
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
