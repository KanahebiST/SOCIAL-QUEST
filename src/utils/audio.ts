// Retro 8-bit RPG Web Audio Synthesizer

class AudioManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleSound(enabled?: boolean) {
    this.soundEnabled = enabled !== undefined ? enabled : !this.soundEnabled;
    return this.soundEnabled;
  }

  public toggleMute(): boolean {
    this.soundEnabled = !this.soundEnabled;
    return !this.soundEnabled;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public getMuted(): boolean {
    return !this.soundEnabled;
  }

  // 8-bit Beep note helper
  private play8BitTone(freq: number, duration: number, startTime: number, type: OscillatorType = 'square', gainValue = 0.1) {
    if (!this.ctx || !this.soundEnabled) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(gainValue, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Ignore audio failure
    }
  }

  // Standard Button Click
  public playClick() {
    this.initCtx();
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    this.play8BitTone(523.25, 0.05, now, 'triangle', 0.1);
  }

  // Item Equip / Tab Switch
  public playEquip() {
    this.initCtx();
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    this.play8BitTone(440, 0.04, now, 'square', 0.08);
    this.play8BitTone(659.25, 0.08, now + 0.04, 'square', 0.08);
  }

  // Mission / Action Success
  public playSuccess() {
    this.initCtx();
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    this.play8BitTone(523.25, 0.08, now, 'square', 0.1);       // C5
    this.play8BitTone(659.25, 0.08, now + 0.08, 'square', 0.1); // E5
    this.play8BitTone(783.99, 0.14, now + 0.16, 'square', 0.1); // G5
    this.play8BitTone(1046.5, 0.25, now + 0.24, 'square', 0.12); // C6
  }

  // Level Up Retro RPG Fanfare
  public playLevelUp() {
    this.initCtx();
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    const notes = [
      { f: 523.25, d: 0.1 },  // C5
      { f: 523.25, d: 0.1 },  // C5
      { f: 523.25, d: 0.1 },  // C5
      { f: 659.25, d: 0.15 }, // E5
      { f: 783.99, d: 0.15 }, // G5
      { f: 659.25, d: 0.1 },  // E5
      { f: 783.99, d: 0.1 },  // G5
      { f: 1046.5, d: 0.4 },  // C6
    ];
    let offset = 0;
    notes.forEach((n) => {
      this.play8BitTone(n.f, n.d, now + offset, 'square', 0.12);
      offset += n.d * 0.9;
    });
  }

  // Item Unlock / Rare Get Fanfare
  public playItemUnlock() {
    this.initCtx();
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    this.play8BitTone(587.33, 0.08, now, 'square', 0.1);        // D5
    this.play8BitTone(739.99, 0.08, now + 0.08, 'square', 0.1); // F#5
    this.play8BitTone(880.0, 0.08, now + 0.16, 'square', 0.1);  // A5
    this.play8BitTone(1174.66, 0.35, now + 0.24, 'square', 0.15); // D6
  }

  // Battle: Attack Swing
  public playAttack() {
    this.initCtx();
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    this.play8BitTone(600, 0.04, now, 'sawtooth', 0.12);
    this.play8BitTone(300, 0.06, now + 0.03, 'square', 0.1);
  }

  // Battle: Hit Impact
  public playHit() {
    this.initCtx();
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    this.play8BitTone(180, 0.08, now, 'triangle', 0.18);
    this.play8BitTone(90, 0.1, now + 0.04, 'square', 0.14);
  }

  // Battle: Critical Hit
  public playCritical() {
    this.initCtx();
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    this.play8BitTone(350, 0.05, now, 'square', 0.15);
    this.play8BitTone(700, 0.06, now + 0.04, 'sawtooth', 0.18);
    this.play8BitTone(1050, 0.15, now + 0.09, 'square', 0.18);
  }

  // Battle: Social Skill Magic / Buff
  public playMagic() {
    this.initCtx();
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    this.play8BitTone(523.25, 0.06, now, 'sine', 0.12);
    this.play8BitTone(659.25, 0.06, now + 0.05, 'sine', 0.12);
    this.play8BitTone(880.0, 0.08, now + 0.1, 'triangle', 0.15);
    this.play8BitTone(1046.5, 0.2, now + 0.16, 'sine', 0.15);
  }

  // Battle: Heal
  public playHeal() {
    this.initCtx();
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    this.play8BitTone(440, 0.08, now, 'triangle', 0.1);
    this.play8BitTone(554.37, 0.08, now + 0.06, 'triangle', 0.1);
    this.play8BitTone(659.25, 0.12, now + 0.12, 'sine', 0.12);
    this.play8BitTone(880, 0.2, now + 0.18, 'sine', 0.12);
  }

  // Battle: Purify / Reconciliation Chime
  public playPurify() {
    this.initCtx();
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    const notes = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6
    notes.forEach((freq, idx) => {
      this.play8BitTone(freq, 0.15 + idx * 0.05, now + idx * 0.08, 'sine', 0.12);
    });
  }

  // Battle: Victory Fanfare
  public playVictory() {
    this.initCtx();
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    const notes = [
      { f: 523.25, d: 0.1 },  // C5
      { f: 659.25, d: 0.1 },  // E5
      { f: 783.99, d: 0.1 },  // G5
      { f: 1046.5, d: 0.2 },  // C6
      { f: 880.0, d: 0.1 },   // A5
      { f: 1046.5, d: 0.4 },  // C6
    ];
    let offset = 0;
    notes.forEach((n) => {
      this.play8BitTone(n.f, n.d, now + offset, 'square', 0.12);
      offset += n.d * 0.9;
    });
  }

  // Error / Warning
  public playError() {
    this.initCtx();
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    this.play8BitTone(220, 0.1, now, 'sawtooth', 0.15);
    this.play8BitTone(174.61, 0.2, now + 0.08, 'sawtooth', 0.15);
  }
}

export const audio = new AudioManager();
export const sound = audio; // Alias for backward compatibility
