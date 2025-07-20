import { Injectable } from '@angular/core';
import { GameStateService } from './game-state.service';
import { GameFlowService } from './game-flow.service';
import { SoundService } from './sound.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(
    private stateSvc: GameStateService,
    private flowSvc: GameFlowService,
    private soundSvc: SoundService
  ) { }

  private normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  public usarItem(itemName: string) {
    if (!itemName) {
      this.stateSvc.addLog("Especifique um software para usar. Ex: usar ping sweep", 'log-negativo');
      return;
    }

    const gameState = this.stateSvc.gameState;
    const normalizedItemName = this.normalizeString(itemName);

    const itemKey = Object.keys(this.stateSvc.gameData.itens).find(key => 
      this.normalizeString(this.stateSvc.gameData.itens[key].nome).startsWith(normalizedItemName)
    );

    if (!itemKey || !gameState.heroi_inventory[itemKey] || gameState.heroi_inventory[itemKey] <= 0) {
      this.stateSvc.addLog(`Você não possui o software '${itemName}'.`, 'log-negativo');
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
      this.stateSvc.addLog('O teu Ping Sweep já foi usado neste setor. Ele será recarregado no próximo.', 'log-negativo');
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
    this.stateSvc.addLog(`Você executa o Ping Sweep e sente sua Influência na rede aumentar para ${novaInfluencia.toFixed(0)}%.`, 'log-positivo');
  }

  private prepararUsoRootkit() {
    this.stateSvc.setGameState({ pending_action: { item: 'rootkit', step: 'awaiting_target' } });
    this.stateSvc.addLog('Em qual contacto você deseja usar o Rootkit de Acesso Total? (digite o codinome)', 'log-sistema');
  }

  public usarEscrituraNoAlvo(targetName: string) {
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

      this.stateSvc.addLog(`Você executa o Rootkit em ${alvo.toUpperCase()}. A Confiança dele(a) é garantida em 100%!`, 'log-positivo');
      this.flowSvc.checkPhaseCompletion();
    } else {
      this.stateSvc.addLog(`Alvo inválido. Você só pode usar o Rootkit em contactos neutros. A ação foi cancelada.`, 'log-negativo');
      this.stateSvc.setGameState({ pending_action: null });
    }
  }

  private usarModulador() {
    const novoEstado = !this.stateSvc.gameState.modulador_ativo;
    this.stateSvc.setGameState({ modulador_ativo: novoEstado });
    const msg = novoEstado ? 'Você ativou o Modulador de Sinal. Sua assinatura na rede está agora ofuscada.' : 'Você desativou o Modulador de Sinal.';
    this.stateSvc.addLog(`[SOFTWARE]: ${msg}`, 'log-positivo');
  }

  private usarFirewallBreaker() {
    const novoEstado = !this.stateSvc.gameState.firewall_breaker_ativo;
    this.stateSvc.setGameState({ firewall_breaker_ativo: novoEstado });
    const msg = novoEstado ? 'Você ativou o Firewall Breaker. Uma barreira de proteção envolve a tua conexão, repelindo o rastreamento do ICE.' : 'Você desativou o Firewall Breaker.';
    this.stateSvc.addLog(`[SOFTWARE]: ${msg}`, 'log-positivo');
  }
}