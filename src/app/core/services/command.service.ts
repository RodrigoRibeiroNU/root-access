import { Injectable } from '@angular/core';
import { GameStateService } from './game-state.service';
import { GameFlowService } from './game-flow.service';
import { CharacterService } from './character.service';
import { ItemService } from './item.service';
import { InactivityService } from './inactivity.service';
import { SoundService } from './sound.service';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class CommandService {
  private audioInitialized = false; 

  private readonly commandMap: Map<string, Function> = new Map([
    ['new', () => this.flowSvc.startOpeningSequence()],
    ['help', () => this.stateSvc.addLog(this.langSvc.getString('commands.help_list'), 'log-positivo')],
    ['online', () => this.listarContactosOnline()],
    ['keys', () => this.listarFragmentosChave()],
    ['inventory', () => this.listarInventario()],
    ['talk', () => this.characterSvc.iniciarDialogo(this.getArgumento())],
    ['answer', () => this.characterSvc.processarRespostaDialogo(this.getComandoOriginal())],
    ['save', () => this.stateSvc.exportSaveToFile()],
    ['load', () => this.stateSvc.triggerFileUpload()],
    ['config', () => this.flowSvc.abrirConfiguracoes()],
    ['use', () => this.itemSvc.usarItem(this.getArgumento())],
    ['exit', () => this.flowSvc.resetGame()]
  ]);
  
  private comandoOriginal = '';
  private argumento = '';

  constructor(
    private stateSvc: GameStateService,
    private flowSvc: GameFlowService,
    private characterSvc: CharacterService,
    private itemSvc: ItemService,
    private inactivitySvc: InactivityService,
    private soundSvc: SoundService,
    private langSvc: LanguageService
  ) { }

  private getComandoOriginal(): string { return this.comandoOriginal; }
  private getArgumento(): string { return this.argumento; }

  private normalizeString(str: string): string {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  private initializeAudio() {
    if (!this.audioInitialized) {
      this.soundSvc.init(this.stateSvc.gameData.config.audio);
      this.audioInitialized = true;
    }
  }

  public processCommand(command: string) {
    this.initializeAudio();
    this.comandoOriginal = command;

    const gameState = this.stateSvc.gameState;
    if (gameState.game_over) return;

    if (gameState.pending_action) {
      if (gameState.pending_action.item === 'rootkit') {
        this.itemSvc.usarRootkitNoAlvo(command);
      }
      return;
    }

    if (command.trim().toLowerCase() === 'screensaver.exe') {
      this.inactivitySvc.forceScreensaver();
      return;
    }
    
    this.stateSvc.addLog(`> ${command}`, 'log-heroi');

    const normalizedCommand = this.normalizeString(command);
    const parts = normalizedCommand.split(' ');
    const acaoDigitada = parts[0];
    this.argumento = parts.slice(1).join(' ');

    // --- CORRIGIDO AQUI ---
    const comandosTraduzidos = this.langSvc.getTranslationObject('commands');
    let acaoEncontrada: string | null = null;

    for (const key in comandosTraduzidos) {
      if (comandosTraduzidos[key] === acaoDigitada) {
        acaoEncontrada = key;
        break;
      }
    }

    if (gameState.dialogo_atual && acaoEncontrada !== 'answer') {
      this.stateSvc.addLog(this.langSvc.getString('system_messages.must_answer'), 'log-sistema');
      return;
    }

    if (acaoEncontrada && this.commandMap.has(acaoEncontrada)) {
      const funcaoDoComando = this.commandMap.get(acaoEncontrada);
      if (funcaoDoComando) {
        funcaoDoComando();
      }
    } else {
      this.stateSvc.addLog(this.langSvc.getString('system_messages.command_invalid', acaoDigitada), 'log-negativo');
      this.soundSvc.playSfx('corrupcao');
    }

    if (!this.stateSvc.gameState.dialogo_atual && !this.stateSvc.gameState.pending_action) {
        this.characterSvc.acaoDoICE();
    }
  }

  private listarContactosOnline(): void {
    const gameState = this.stateSvc.gameState;
    this.stateSvc.addLog(this.langSvc.getString('system_messages.online_contacts'), 'log-sistema');
    Object.entries(gameState.personagens_atuais).forEach(([name, data]) => {
      const confiancaStr = `(${this.langSvc.getString('ui.status_bar_influence')}: ${data.fe.toFixed(0)}%)`;
      this.stateSvc.addLog(`- ${name.toUpperCase()} ${confiancaStr}`, this.characterSvc.getNpcColor(data));
    });
  }

  private listarFragmentosChave(): void {
    const gameState = this.stateSvc.gameState;
    this.stateSvc.addLog(this.langSvc.getString('system_messages.key_fragments_acquired'), 'log-sistema');
    if (gameState.fragmentos_chave.length === 0) {
        this.stateSvc.addLog(this.langSvc.getString('system_messages.no_fragments_found'), 'log-sistema');
        return;
    }
    gameState.fragmentos_chave.forEach(pista => this.stateSvc.addLog(`- ${pista}`, 'log-positivo'));
  }

  private listarInventario(): void {
    const gameState = this.stateSvc.gameState;
    const gameData = this.stateSvc.gameData;
    this.stateSvc.addLog(this.langSvc.getString('system_messages.inventory_software'), 'log-sistema');
    
    const itensDoInventario = Object.keys(gameState.heroi_inventory);

    if (itensDoInventario.every(key => gameState.heroi_inventory[key] === 0)) {
        this.stateSvc.addLog(this.langSvc.getString('system_messages.no_software_available'), 'log-sistema');
        return;
    }

    itensDoInventario.forEach(itemKey => {
        const item = gameData.itens[itemKey];
        const quantidade = gameState.heroi_inventory[itemKey];
        if (item && quantidade > 0) {
            this.stateSvc.addLog(`- ${item.nome} (x${quantidade}): ${item.descricao}`, 'log-positivo');
        }
    });
  }
}