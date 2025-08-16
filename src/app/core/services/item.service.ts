import { Injectable } from '@angular/core';
import { GameStateService } from './game-state.service';
import { GameFlowService } from './game-flow.service';
import { SoundService } from './sound.service';
import { LanguageService } from './language.service'; // Importar o LanguageService

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(
    private stateSvc: GameStateService,
    private flowSvc: GameFlowService,
    private soundSvc: SoundService,
    private langSvc: LanguageService // Injetar o LanguageService
  ) { }

  private normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  public usarItem(itemName: string) {
    if (!itemName) {
      this.stateSvc.addLog(this.langSvc.getString('items.specify_item', 'usar ping sweep'), 'log-negativo');
      return;
    }

    const gameState = this.stateSvc.gameState;
    const normalizedItemName = this.normalizeString(itemName);

    const itemKey = Object.keys(this.stateSvc.gameData.itens).find(key => 
      this.normalizeString(this.stateSvc.gameData.itens[key].nome).startsWith(normalizedItemName)
    );

    if (!itemKey || !gameState.heroi_inventory[itemKey] || gameState.heroi_inventory[itemKey] <= 0) {
      this.stateSvc.addLog(this.langSvc.getString('items.not_owned', itemName), 'log-negativo');
      return;
    }

    switch (itemKey) {
      case 'ping_sweep':
        this.usarPingSweep();
        break;
      case 'rootkit':
        this.prepararUsoRootkit();
        break;
      case 'modulador':
        this.usarModulador();
        break;
      case 'firewall_breaker':
        this.usarFirewallBreaker();
        break;
    }
  }

  private usarPingSweep() {
    if (this.stateSvc.gameState.ping_sweep_usado_no_setor) {
      this.stateSvc.addLog(this.langSvc.getString('items.ping_sweep_used'), 'log-negativo');
      return;
    }
    const influenciaAtual = this.stateSvc.gameState.heroi_influencia_percent;
    const novaInfluencia = Math.min(100, influenciaAtual + 5);

    if (novaInfluencia > influenciaAtual) {
        this.soundSvc.playSfx('luz');
    }

    this.stateSvc.setGameState({ 
        heroi_influencia_percent: novaInfluencia,
        ping_sweep_usado_no_setor: true 
    });
    this.stateSvc.addLog(this.langSvc.getString('items.ping_sweep_success', novaInfluencia.toFixed(0)), 'log-positivo');
  }

  private prepararUsoRootkit() {
    this.stateSvc.setGameState({ pending_action: { item: 'rootkit', step: 'awaiting_target' } });
    this.stateSvc.addLog(this.langSvc.getString('items.rootkit_prompt'), 'log-sistema');
  }

  public usarRootkitNoAlvo(targetName: string) {
    const alvo = this.normalizeString(targetName);
    const personagens = this.stateSvc.gameState.personagens_atuais;
    
    if (personagens[alvo] && personagens[alvo].tipo === 'neutro') {
      personagens[alvo].fe = 100;
      this.stateSvc.setGameState({ personagens_atuais: personagens, pending_action: null });
      
      const inventory = { ...this.stateSvc.gameState.heroi_inventory };
      if (inventory['rootkit'] > 0) {
        inventory['rootkit']--;
      }
      this.stateSvc.setGameState({ heroi_inventory: inventory });

      this.stateSvc.addLog(this.langSvc.getString('items.rootkit_success', alvo.toUpperCase()), 'log-positivo');
      this.flowSvc.checkPhaseCompletion();
    } else {
      this.stateSvc.addLog(this.langSvc.getString('items.rootkit_fail'), 'log-negativo');
      this.stateSvc.setGameState({ pending_action: null });
    }
  }

  private usarModulador() {
    const novoEstado = !this.stateSvc.gameState.modulador_ativo;
    this.stateSvc.setGameState({ modulador_ativo: novoEstado });
    const msg = novoEstado 
      ? this.langSvc.getString('items.modulator_on')
      : this.langSvc.getString('items.modulator_off');
    this.stateSvc.addLog(`[SOFTWARE]: ${msg}`, 'log-positivo');
  }

  private usarFirewallBreaker() {
    const novoEstado = !this.stateSvc.gameState.firewall_breaker_ativo;
    this.stateSvc.setGameState({ firewall_breaker_ativo: novoEstado });
    const msg = novoEstado 
      ? this.langSvc.getString('items.firewall_breaker_on')
      : this.langSvc.getString('items.firewall_breaker_off');
    this.stateSvc.addLog(`[SOFTWARE]: ${msg}`, 'log-positivo');
  }
}