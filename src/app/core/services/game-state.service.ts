import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { GameState, NpcData, LogLine, GameView } from '../models/game.interfaces';
import packageInfo from '../../../../package.json';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private readonly initialGameState: GameState = {
    current_view: 'loading',
    fase_atual: 1,
    heroi_influencia_percent: 70,
    fragmentos_chave: [],
    personagens_atuais: {},
    all_characters_in_game_pool: {},
    game_over: false,
    dialogo_atual: null,
    nome_jogador_global: "",
    heroi_inventory: {},
    objetivo_fase_concluido: false,
    fase_final_iniciada: false,
    pending_action: null,
    ping_sweep_usado_no_setor: false,
    modulador_ativo: false,
    firewall_breaker_ativo: false,
    previous_view: undefined,
    recent_log: [],
  };

  private readonly _gameState = new BehaviorSubject<GameState>(this.getInitialGameState());
  readonly gameState$ = this._gameState.asObservable();

  private readonly _terminalLog = new BehaviorSubject<LogLine[]>([]);
  readonly terminalLog$ = this._terminalLog.asObservable();

  private readonly _fileUploadTrigger = new Subject<void>();
  readonly fileUploadTrigger$ = this._fileUploadTrigger.asObservable();

  public gameData: any = {};

  constructor() { }

  public getInitialGameState(): GameState {
    return JSON.parse(JSON.stringify(this.initialGameState));
  }

  get gameState(): GameState {
    return this._gameState.getValue();
  }

  setGameState(newState: Partial<GameState>) {
    const currentState = this.gameState;
    const nextState = { ...currentState, ...newState };

    if (nextState.fase_atual > currentState.fase_atual) {
      nextState.ping_sweep_usado_no_setor = false;
      this.addLog('[SISTEMA]: O teu software "Ping Sweep" foi recarregado para este novo setor da rede.', 'log-positivo');
    }

    this._gameState.next(nextState);
  }

  public addLog(text: string, className: string = '') {
    const LARGURA_MAXIMA_TERMINAL = 90; // Ajusta este valor conforme o design do teu terminal
    const currentLog = this._terminalLog.getValue();
    const newLines: LogLine[] = [];

    // Remove a tag de parágrafo se ela já existir para evitar aninhamento
    const cleanText = text.replace(/<\/?p>/g, '');

    const wrappedLines = this.wordWrap(cleanText, LARGURA_MAXIMA_TERMINAL);
    
    wrappedLines.forEach(line => {
      newLines.push({ text: line, className });
    });

    this._terminalLog.next([...currentLog, ...newLines]);
  }

  public clearLog() {
    this._terminalLog.next([]);
  }

  public triggerFileUpload() {
    this._fileUploadTrigger.next();
  }
  
  public addLogBlock(lines: LogLine[]) {
    const currentLog = this._terminalLog.getValue();
    this._terminalLog.next([...currentLog, ...lines]);
  }

  public loadGameFromFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text === 'string') {
          const loadedState: GameState = JSON.parse(text);
          loadedState.current_view = 'gameplay'; 
          
          this.clearLog();

          if (loadedState.recent_log && loadedState.recent_log.length > 0) {
            this.addLogBlock(loadedState.recent_log);
            this.addLog("--------------------------------------------------", "log-sistema");
          }
          
          delete loadedState.recent_log;
          
          const personagensSalvos = { ...loadedState.personagens_atuais };
          this.setGameState({ ...loadedState, personagens_atuais: {} });
          const personagensRecarregados: { [key: string]: NpcData } = {};

          for (let i = 1; i <= loadedState.fase_atual; i++) {
              const phaseKey = `fase_${i}`;
              const phaseData = this.gameData.fases_jogo[phaseKey];
              if (phaseData) {
                  const adicionarOuAtualizarPersonagem = (npcName: string) => {
                    if (!npcName) return;
                    if (personagensSalvos[npcName]) {
                        personagensRecarregados[npcName] = personagensSalvos[npcName];
                    } 
                    else if (loadedState.all_characters_in_game_pool[npcName]) {
                        personagensRecarregados[npcName] = JSON.parse(JSON.stringify(loadedState.all_characters_in_game_pool[npcName]));
                    }
                  };
                  phaseData.initial_active_npcs.forEach(adicionarOuAtualizarPersonagem);
                  if (i < loadedState.fase_atual || (i === loadedState.fase_atual && loadedState.objetivo_fase_concluido)) {
                      adicionarOuAtualizarPersonagem(phaseData.lider);
                  }
              }
          }
          
          this.setGameState({ personagens_atuais: personagensRecarregados });
          this.addLog("Transmissão carregada com sucesso a partir do ficheiro!", 'log-positivo');
        }
      } catch (error) {
        this.addLog("Erro: O ficheiro de save parece estar corrompido ou tem um formato inválido.", 'log-negativo');
      }
    };
    reader.readAsText(file);
  }

  private wordWrap(text: string, maxWidth: number): string[] {
    if (text.length <= maxWidth) {
      return [text];
    }

    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      // Verifica se a palavra sozinha excede o limite (caso extremo)
      if (word.length > maxWidth) {
        if (currentLine.length > 0) {
          lines.push(currentLine);
        }
        lines.push(word); // Adiciona a palavra longa numa linha própria
        currentLine = '';
        continue;
      }

      // Verifica se adicionar a próxima palavra excede o limite
      if ((currentLine + ' ' + word).trim().length > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        if (currentLine.length === 0) {
          currentLine = word;
        } else {
          currentLine += ' ' + word;
        }
      }
    }

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    return lines;
  }

  public exportSaveToFile() {
    const HISTORICO_A_SALVAR = 10;
    const logCompleto = this._terminalLog.getValue();
    const logRecente = logCompleto.slice(-HISTORICO_A_SALVAR);

    const estadoParaSalvar = { ...this.gameState, recent_log: logRecente };

    const dataStr = JSON.stringify(estadoParaSalvar, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `noterminal_save_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
    this.addLog("Ficheiro de save encriptado. Verifique os seus downloads.", 'log-positivo');
  }
}