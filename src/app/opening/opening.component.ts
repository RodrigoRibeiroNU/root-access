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
    'A OmniCorp controla o mundo.',
    'Nas ruas e na rede, a liberdade é uma palavra esquecida.',
    'A informação é a nova moeda, e a corporação vigia cada byte',
    'com os seus sistemas de segurança, o ICE.',
    'Mas nas sombras da darknet, dissidentes ainda resistem',
    'a partir de terminais anónimos.',
    'Um contacto, o "Oráculo", procura agentes para expor a verdade.',
    'O alvo: o "Dossier Fantasma", um ficheiro encriptado',
    'cuja chave de desencriptação foi dividida em fragmentos.',
    'Você é o mais recente recruta.',
    'A sua missão: reunir os fragmentos e derrubar o sistema.',
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