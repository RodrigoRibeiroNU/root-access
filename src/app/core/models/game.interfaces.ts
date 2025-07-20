export type GameView = 'loading' | 'title' | 'opening' | 'menu' | 'gameplay' | 'ending' | 'settings';

export interface NpcData {
  tipo: 'guia' | 'agente' | 'neutro' | 'lider' | 'sabio';
  fe: number; // A 'fé' interna dos NPCs pode manter o nome, pois é a mecânica base
  dialogos: any;
}

export interface PendingAction {
  item: string;
  step: 'awaiting_target';
}

export interface GameState {
  current_view: GameView;
  fase_atual: number;
  heroi_influencia_percent: number; // Renomeado de heroi_fe_percent
  fragmentos_chave: string[]; // Renomeado de pistas
  personagens_atuais: { [key: string]: NpcData };
  all_characters_in_game_pool: { [key: string]: NpcData };
  game_over: boolean;
  dialogo_atual: { npc: string, opcoes: any[] } | null;
  nome_jogador_global: string;
  heroi_inventory: { [key: string]: number };
  objetivo_fase_concluido: boolean;
  fase_final_iniciada: boolean;
  pending_action: PendingAction | null;
  ping_sweep_usado_no_setor: boolean; // Renomeado de oracao_usada_na_fase_atual
  modulador_ativo: boolean; // Renomeado de crucifixo_ativo
  firewall_breaker_ativo: boolean; // Renomeado de rosario_ativo
  previous_view?: GameView;
  recent_log?: LogLine[];
}

export interface LogLine {
  text: string;
  className: string;
}