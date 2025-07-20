import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-screensaver',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './screensaver.component.html',
  styleUrls: ['./screensaver.component.css']
})
export class ScreensaverComponent implements OnInit, OnDestroy {
  // Array com os frames da animação
  frames: string[] = [];
  // Frame atualmente visível
  currentFrame = 0;
  // Controlador do intervalo da animação
  private animationInterval: any;

  ngOnInit(): void {
    this.criarFrames();
    this.iniciarAnimacao();
  }

  ngOnDestroy(): void {
    // Limpa o intervalo quando o componente é destruído para evitar memory leaks
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  /**
   * Inicia o ciclo da animação, trocando de frame a cada 150ms.
   */
  private iniciarAnimacao(): void {
    this.animationInterval = setInterval(() => {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }, 150); // 150ms de intervalo entre frames. Podes ajustar este valor.
  }

  /**
   * Gera os frames da animação.
   * Criei 3 frames com pequenas variações nas chamas.
   */
  private criarFrames(): void {
    const baseSkull = [
      '    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@    ',
      '     @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@     ',
      '      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@      ',
      '     @@@@@           @@@@@@@@@@@@@@@@@@@           @@@@@     ',
      '     @@@@@@             @@@@@@@@@@@@@             @@@@@@     ',
      '      @@@@@@@        ..     @@@@@@@@@     ..        @@@@@@   ',
      '       @@@@@@@@             @@@@@             @@@@@@@@       ',
      '           @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@           ',
      '              @@@@@@@@@@@@@@@   @@@@@@@@@@@@@@@              ',
      '                  @@@@@@@@@@     @@@@@@@@@@                  ',
      '                   @@@@@@@@       @@@@@@@@                   ',
      '                  @@@@@@@@@ @@@@@ @@@@@@@@@                  ',
      '                 @@@@@@@@@@@@@@@@@@@@@@@@@@@                 ',
      '                 @@@  @@@@@@@@@@@@@@@@@  @@@                 ',
      '                  @@  @@@@  @@@@@  @@@@  @@                  ',
      '                      @@@@  @@@@@  @@@@                      '
    ];

    const flames1 = [
      '                        @         @                          ',
      '                         @         @                         ',
      '                     @   @         @   @                     ',
      '                     @  @@         @@  @                     ',
      '                     @@ @@@       @@@ @@                     ',
      '             @      @@   @@@     @@@   @@      @             ',
      '            @@      @@   @@@     @@@   @@      @@            ',
      '           @@      @@    @@@@   @@@@    @@      @@           ',
      '           @@     @@@    @@@@  @@@@@    @@@     @@@          ',
      '       @  @@@    @@@@    @@@@   @@@@    @@@@   @@@@  @       ',
      '       @@ @@@@@  @@@@   @@@@@   @@@@@   @@@@  @@@@@ @@       ',
      '       @@ @@@@@  @@@@@@@@@@@     @@@@@@@@@@@  @@@@@ @@       ',
      '       @@ @@@@@  @@@@@@@@@@@     @@@@@@@@@@@  @@@@@ @@       ',
      '      @@@  @@@@   @@@@@@@@@@@@@@@@@@@@@@@@@   @@@@  @@@      ',
      '     @@@@  @@@@   @@@@@@@@@@@@@@@@@@@@@@@@@   @@@@  @@@@     ',
      '    @@@@   @@@@@ @@@@@@@@@@@@@@@@@@@@@@@@@@@ @@@@@   @@@@    ',
      '   @@@@    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@   @@@@    ',
      '   @@@@@  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  @@@@    '
    ];
    const flames2 = [
      '                         @         @                         ',
      '                        @         @                          ',
      '                    @   @         @   @                      ',
      '                    @  @@         @@  @                      ',
      '                    @@ @@@       @@@ @@                      ',
      '            @      @@   @@@     @@@   @@      @              ',
      '           @@      @@   @@@     @@@   @@      @@             ',
      '           @@      @@    @@@@   @@@@    @@      @@           ',
      '           @@     @@@    @@@@  @@@@@    @@@     @@@          ',
      '       @  @@@    @@@@    @@@@   @@@@    @@@@   @@@@  @       ',
      '       @@ @@@@@  @@@@   @@@@@   @@@@@   @@@@  @@@@@ @@       ',
      '       @@ @@@@@  @@@@@@@@@@@     @@@@@@@@@@@  @@@@@ @@       ',
      '       @@ @@@@@  @@@@@@@@@@@     @@@@@@@@@@@  @@@@@ @@       ',
      '      @@@  @@@@   @@@@@@@@@@@@@@@@@@@@@@@@@   @@@@  @@@      ',
      '     @@@@  @@@@   @@@@@@@@@@@@@@@@@@@@@@@@@   @@@@  @@@@     ',
      '    @@@@   @@@@@ @@@@@@@@@@@@@@@@@@@@@@@@@@@ @@@@@   @@@@    ',
      '   @@@@    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@   @@@@    ',
      '   @@@@@  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  @@@@    '
    ];
    const flames3 = [
      '                        @         @                          ',
      '                         @         @                         ',
      '                     @   @         @   @                     ',
      '                     @  @@         @@  @                     ',
      '                     @@ @@@       @@@ @@                     ',
      '             @      @@   @@@     @@@   @@      @             ',
      '            @@      @@   @@@     @@@   @@      @@            ',
      '          @@      @@    @@@@   @@@@    @@      @@            ',
      '          @@     @@@    @@@@  @@@@@    @@@     @@@           ',
      '      @  @@@    @@@@    @@@@   @@@@    @@@@   @@@@  @        ',
      '      @@ @@@@@  @@@@   @@@@@   @@@@@   @@@@  @@@@@ @@        ',
      '      @@ @@@@@  @@@@@@@@@@@     @@@@@@@@@@@  @@@@@ @@        ',
      '      @@ @@@@@  @@@@@@@@@@@     @@@@@@@@@@@  @@@@@ @@        ',
      '      @@@  @@@@   @@@@@@@@@@@@@@@@@@@@@@@@@   @@@@  @@@      ',
      '     @@@@  @@@@   @@@@@@@@@@@@@@@@@@@@@@@@@   @@@@  @@@@     ',
      '    @@@@   @@@@@ @@@@@@@@@@@@@@@@@@@@@@@@@@@ @@@@@   @@@@    ',
      '   @@@@    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@   @@@@    ',
      '   @@@@@  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  @@@@    '
    ];

    // Monta os frames completos
    this.frames.push([...flames1, ...baseSkull].join('\n'));
    this.frames.push([...flames2, ...baseSkull].join('\n'));
    this.frames.push([...flames3, ...baseSkull].join('\n'));
  }
}