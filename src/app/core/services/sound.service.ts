import { Injectable } from '@angular/core';

export type SoundEffect = 'sucesso' | 'corrupcao' | 'luz';
export type MusicTrack = 'abertura' | 'hino' | 'urgente';

interface AudioConfig {
  geral_habilitado: boolean;
  musica_habilitada: boolean;
  sfx_habilitado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private audioCtx: AudioContext | null = null;
  private isMusicPlaying = false;
  private proximoTimeoutNota: any = null;

  private config: AudioConfig = {
    geral_habilitado: true,
    musica_habilitada: true,
    sfx_habilitado: true
  };

  constructor() { }
  
  public getConfig(): AudioConfig {
    return this.config;
  }
  
  public init(initialConfig: AudioConfig): void {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.config = initialConfig;
      console.log("AudioContext iniciado com a configuração:", this.config);
    }
  }

  public updateConfig(newConfig: AudioConfig): void {
    this.config = newConfig;
    if (!this.config.geral_habilitado || !this.config.musica_habilitada) {
      this.stopMusic();
    }
  }

  private tocarSom(frequencia = 440, duracao = 0.2, tipoOnda: OscillatorType = 'square', volume = 1): void {
    if (!this.audioCtx || !this.config.geral_habilitado) return;
    
    const oscilador = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    oscilador.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);
    
    oscilador.type = tipoOnda;
    oscilador.frequency.setValueAtTime(frequencia, this.audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioCtx.currentTime + duracao);
    
    oscilador.start(this.audioCtx.currentTime);
    oscilador.stop(this.audioCtx.currentTime + duracao);
  }

  public playSfx(effect: SoundEffect): void {
    if (!this.audioCtx || !this.config.sfx_habilitado || !this.config.geral_habilitado) return;

    switch (effect) {
      case 'sucesso':
        this.tocarEfeitoSucesso();
        break;
      case 'corrupcao':
        this.tocarEfeitoCorrupcao();
        break;
      case 'luz':
        this.tocarEfeitoLuz();
        break;
    }
  }
  
  public playMusic(track: MusicTrack): void {
    if (!this.audioCtx || !this.config.musica_habilitada || !this.config.geral_habilitado) return;
    
    this.stopMusic(); // Para qualquer música que esteja a tocar antes de iniciar a nova

    this.isMusicPlaying = true;
    switch (track) {
      case 'abertura':
        this.tocarMusicaAbertura();
        break;
      case 'hino':
        this.tocarHinoAmanhecer();
        break;
      case 'urgente':
        this.tocarMusicaUrgente();
        break;
    }
  }

  public stopMusic(): void {
    this.isMusicPlaying = false;
    if (this.proximoTimeoutNota) {
      clearTimeout(this.proximoTimeoutNota);
      this.proximoTimeoutNota = null;
    }
  }
  
  private tocarMusicaUrgente(): void {
    const BPM = 150;
    const duracaoOitavo = (60 / BPM) / 2;
    const duracaoNota = duracaoOitavo * 0.9;
    const volumeMusica = 0.4;
    const tipoOnda: OscillatorType = 'triangle';
    const sequencia = [
        { nota: 65.41, duracao: 1 }, { nota: 65.41, duracao: 1 }, { nota: 98.00, duracao: 2 },
        { nota: 65.41, duracao: 1 }, { nota: 65.41, duracao: 1 }, { nota: 103.83, duracao: 2 },
        { nota: 65.41, duracao: 1 }, { nota: 65.41, duracao: 1 }, { nota: 98.00, duracao: 2 },
        { nota: 77.78, duracao: 1 }, { nota: 73.42, duracao: 1 }, { nota: 65.41, duracao: 2 },
    ];
    let indiceAtual = 0;
    const tocarProximaNota = () => {
        if (!this.isMusicPlaying) return;
        if (indiceAtual >= sequencia.length) indiceAtual = 0;
        const notaAtual = sequencia[indiceAtual];
        this.tocarSom(notaAtual.nota, duracaoNota * notaAtual.duracao, tipoOnda, volumeMusica);
        this.proximoTimeoutNota = setTimeout(tocarProximaNota, duracaoOitavo * notaAtual.duracao * 1000);
        indiceAtual++;
    };
    tocarProximaNota();
  }

  private tocarHinoAmanhecer(): void {
    const dn = 0.25, v = 0.5, t = 300;
    setTimeout(() => this.tocarSom(261.63, dn, 'triangle', v), t * 0);
    setTimeout(() => this.tocarSom(329.63, dn, 'triangle', v), t * 1);
    setTimeout(() => this.tocarSom(392.00, dn, 'triangle', v), t * 2);
    setTimeout(() => this.tocarSom(523.25, dn * 2, 'triangle', v), t * 3);
  }

  private tocarEfeitoSucesso(): void {
    this.tocarSom(880, 0.1, 'sine', 0.7);
    setTimeout(() => this.tocarSom(1046.50, 0.15, 'sine', 0.7), 120);
  }

  private tocarEfeitoCorrupcao(): void {
    this.tocarSom(220, 0.3, 'sawtooth', 0.8);
    setTimeout(() => this.tocarSom(207.65, 0.3, 'sawtooth', 0.8), 50);
  }

  private tocarEfeitoLuz(): void {
    const dn = 0.08, v = 0.6, t = 90;
    setTimeout(() => this.tocarSom(523.25, dn, 'triangle', v), t * 0);
    setTimeout(() => this.tocarSom(659.25, dn, 'triangle', v), t * 1);
    setTimeout(() => this.tocarSom(783.99, dn, 'triangle', v), t * 2);
  }
  
  private tocarMusicaAbertura(): void {
    console.log("Iniciando música de abertura...");

    // --- 0.0s: Animação "Power On" (Duração: 2.5s) ---
    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            const freq = 50 + (i * 20);
            this.tocarSom(freq, 0.1, 'sawtooth', 0.1 + (i * 0.01));
        }, i * 100);
    }

    // --- 2.5s: Início da Pausa (Duração: 2.0s) ---
    setTimeout(() => {
        this.tocarSom(32.70, 17, 'sine', 0.6);
    }, 2500);

    // --- 4.5s: Início da Digitação do Texto (Duração: 15s) ---
    const BPM = 150;
    const duracaoOitavo = (60 / BPM) / 2;

    // CAMADA 1: Linha de Baixo (Começa aos 4.5s)
    setTimeout(() => {
        const baixo = [{ n: 65.41, d: 2 }, { n: 98.00, d: 2 }, { n: 103.83, d: 4 }];
        for (let i = 0; i < 9; i++) {
            const delayBase = i * (duracaoOitavo * 8 * 1000);
            setTimeout(() => this.tocarSom(baixo[0].n, duracaoOitavo * baixo[0].d, 'triangle', 0.5), delayBase);
            setTimeout(() => this.tocarSom(baixo[1].n, duracaoOitavo * baixo[1].d, 'triangle', 0.5), delayBase + (duracaoOitavo * 2 * 1000));
            setTimeout(() => this.tocarSom(baixo[2].n, duracaoOitavo * baixo[2].d, 'triangle', 0.5), delayBase + (duracaoOitavo * 4 * 1000));
        }
    }, 4500);

    // CAMADA 2: Harmonia Sustentada (Começa aos 9.5s)
    setTimeout(() => {
        this.tocarSom(155.56, 10, 'sine', 0.3);
    }, 9500);
    
    // CAMADA 3: Contra-ritmo Urgente (Começa aos 14.5s)
    setTimeout(() => {
        for (let i = 0; i < 10; i++) {
             setTimeout(() => {
                 this.tocarSom(261.63, duracaoOitavo * 0.5, 'square', 0.2);
             }, i * (duracaoOitavo * 2 * 1000));
        }
    }, 14500);


    // --- 19.5s: Início da Pausa Final (Duração: 3.0s) ---
    setTimeout(() => {
        console.log("Clímax da música e fade out...");
        const volumeFinal = 0.7;
        const duracaoFade = 2.5;
        this.tocarSom(130.81, duracaoFade, 'triangle', volumeFinal); // C3
        this.tocarSom(155.56, duracaoFade, 'triangle', volumeFinal); // Eb3
        this.tocarSom(196.00, duracaoFade, 'triangle', volumeFinal); // G3
    }, 19500);
  }
}