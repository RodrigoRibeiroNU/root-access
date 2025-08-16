import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameStateService } from '../core/services/game-state.service';
import { GameFlowService } from '../core/services/game-flow.service';
import { SoundService } from '../core/services/sound.service';
import { LanguageService } from '../core/services/language.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  // Modelos para os checkboxes de áudio
  geralHabilitado: boolean;
  musicaHabilitada: boolean;
  sfxHabilitado: boolean;
  
  // Modelo para o seletor de idioma
  idiomaSelecionado: string;

  private configAnterior: { musica_habilitada: boolean };

  constructor(
    private stateSvc: GameStateService,
    private flowSvc: GameFlowService,
    private soundSvc: SoundService,
    public langSvc: LanguageService // Público para ser usado no template
  ) {
    const audioConfig = this.soundSvc.getConfig();
    this.geralHabilitado = audioConfig.geral_habilitado;
    this.musicaHabilitada = audioConfig.musica_habilitada;
    this.sfxHabilitado = audioConfig.sfx_habilitado;

    this.idiomaSelecionado = this.langSvc.getInitialLanguage();

    this.configAnterior = { musica_habilitada: this.musicaHabilitada };
  }

  salvarConfiguracoes() {
    // Salva as configurações de áudio
    const novaConfigAudio = {
      geral_habilitado: this.geralHabilitado,
      musica_habilitada: this.musicaHabilitada,
      sfx_habilitado: this.sfxHabilitado
    };
    this.soundSvc.updateConfig(novaConfigAudio);

    // Salva a configuração de idioma
    this.langSvc.setLanguage(this.idiomaSelecionado).subscribe(() => {
        // Lógica de reinício da música
        if (novaConfigAudio.musica_habilitada && !this.configAnterior.musica_habilitada) {
            if (this.stateSvc.gameState.current_view === 'gameplay' || this.stateSvc.gameState.previous_view === 'gameplay') {
                this.flowSvc.startGameplayMusic();
            }
        }
        // Volta para o menu anterior
        this.flowSvc.voltarParaMenu();
    });
  }

  voltar() {
    this.flowSvc.voltarParaMenu();
  }
}