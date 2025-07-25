import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoundService } from '../core/services/sound.service';

@Component({
  selector: 'app-opening',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './opening.component.html',
  styleUrls: ['./opening.component.css']
})
export class OpeningComponent implements OnInit, OnDestroy {
  @Output() openingComplete = new EventEmitter<void>();

  introText = [
    'A rede está sob o controlo da OmniCorp.',
    'A liberdade é uma memória distante, um eco na estática.',
    'Mas nas sombras, um sinal de origem desconhecida chama por agentes.',
    'Você atendeu à chamada.',
    'A sua missão: encontrar o "Dossier Fantasma" e expor a verdade.',
    'A sua operação começa agora.'
  ];

  displayedText: string[] = [];
  animationStep = 'power-on';
  private timers: any[] = [];

  constructor(private soundSvc: SoundService) {}

  ngOnInit() {
    this.soundSvc.playMusic('abertura');
    const powerOnTimer = setTimeout(() => {
      this.animationStep = 'scanline';
      const typingTimer = setTimeout(() => {
        this.startTyping();
      }, 2000);
      this.timers.push(typingTimer);
    }, 2500);
    this.timers.push(powerOnTimer);
  }

  ngOnDestroy() {
    this.soundSvc.stopMusic();
    this.timers.forEach(clearTimeout);
  }

  startTyping() {
    this.animationStep = 'typing';
    this.typeLine(0);
  }

  typeLine(index: number) {
    if (index >= this.introText.length) {
      const completeTimer = setTimeout(() => {
        this.openingComplete.emit();
      }, 4000);
      this.timers.push(completeTimer);
      return;
    }

    this.displayedText.push(this.introText[index]);
    const nextLineTimer = setTimeout(() => {
      this.typeLine(index + 1);
    }, 2500);
    this.timers.push(nextLineTimer);
  }
}