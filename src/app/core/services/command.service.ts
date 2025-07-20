import { Injectable } from '@angular/core';
import { GameStateService } from './game-state.service';
import { GameFlowService } from './game-flow.service';
import { CharacterService } from './character.service';
import { ItemService } from './item.service';
import { InactivityService } from './inactivity.service';
import { SoundService } from './sound.service';

@Injectable({
  providedIn: 'root'
})
export class CommandService {
  private audioInitialized = false; 

  constructor(
    private stateSvc: GameStateService,
    private flowSvc: GameFlowService,
    private characterSvc: CharacterService,
    private itemSvc: ItemService,
    private inactivitySvc: InactivityService,
    private soundSvc: SoundService
  ) { }

  private normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u00e0-\u00e5\u00e8-\u00eb\u00ec-\u00ef\u00f2-\u00f6\u00f9-\u00fc\u00fd\u00ff]/g, "a");
  }

  private initializeAudio() {
    if (!this.audioInitialized) {
      this.soundSvc.init(this.stateSvc.gameData.config.audio);
      this.audioInitialized = true;
    }
  }

  public processCommand(command: string) {
    this.initializeAudio();

    const gameState = this.stateSvc.gameState;
    if (gameState.game_over) return;

    if (gameState.pending_action) {
      if (gameState.pending_action.item === 'rootkit') {
        this.itemSvc.usarEscrituraNoAlvo(command);
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
    const acao = parts[0];
    const argumento = parts.slice(1).join(' ');

    if (gameState.dialogo_atual && acao !== 'responder') {
      this.stateSvc.addLog("Use 'responder [num]' para continuar a transmissão.", 'log-sistema');
      return;
    }

    const comandos: { [key: string]: Function } = {
      "novo": () => this.flowSvc.startOpeningSequence(),
      "ajuda": () => this.stateSvc.addLog("Comandos: falar, usar, online, chaves, inventario, salvar, carregar, config, sair", 'log-positivo'),
      "online": () => this.listarPersonagensOnline(),
      "chaves": () => this.listarPistas(),
      "inventario": () => this.listarInventario(),
      "falar": () => this.characterSvc.iniciarDialogo(argumento),
      "responder": () => this.characterSvc.processarRespostaDialogo(command),
      "salvar": () => this.stateSvc.exportSaveToFile(),
      "carregar": () => this.stateSvc.triggerFileUpload(),
      "config": () => this.flowSvc.abrirConfiguracoes(),
      "usar": () => this.itemSvc.usarItem(argumento),
      "sair": () => this.flowSvc.resetGame()
    };

    if (comandos[acao]) {
      comandos[acao]();
    } else {
      this.stateSvc.addLog(`Comando inválido: ${acao}. Sinal perdido.`, 'log-negativo');
      this.soundSvc.playSfx('corrupcao');
    }

    if (!this.stateSvc.gameState.dialogo_atual && !this.stateSvc.gameState.pending_action) {
        this.characterSvc.acaoDoICE();
    }
  }

  private listarPersonagensOnline(): void {
    const gameState = this.stateSvc.gameState;
    this.stateSvc.addLog("Contactos online:", 'log-sistema');
    Object.entries(gameState.personagens_atuais).forEach(([name, data]) => {
      const feStr = `(Confiança: ${data.fe.toFixed(0)}%)`;
      this.stateSvc.addLog(`- ${name.toUpperCase()} ${feStr}`, this.characterSvc.getNpcColor(data));
    });
  }

  private listarPistas(): void {
    const gameState = this.stateSvc.gameState;
    this.stateSvc.addLog("Fragmentos da chave adquiridos:", 'log-sistema');
    if (gameState.fragmentos_chave.length === 0) {
        this.stateSvc.addLog("Nenhum fragmento encontrado.", 'log-sistema');
        return;
    }
    gameState.fragmentos_chave.forEach(pista => this.stateSvc.addLog(`- ${pista}`, 'log-positivo'));
  }

  private listarInventario(): void {
    const gameState = this.stateSvc.gameState;
    const gameData = this.stateSvc.gameData;
    this.stateSvc.addLog("Software no inventário:", 'log-sistema');
    
    const itensDoInventario = Object.keys(gameState.heroi_inventory);

    if (itensDoInventario.every(key => gameState.heroi_inventory[key] === 0)) {
        this.stateSvc.addLog("Nenhum software disponível.", 'log-sistema');
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