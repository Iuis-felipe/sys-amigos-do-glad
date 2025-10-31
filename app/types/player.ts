// Tipos de dados para o sistema de futebol
export interface Player {
  id: string;
  name: string;
  position: Position;
  overall: number; // Rating geral (0-99)
  attributes: PlayerAttributes;
  photo?: string; // URL da foto do jogador
  club?: string;
  nationality?: string;
  age?: number;
}

export interface PlayerAttributes {
  pace: number; // Velocidade
  shooting: number; // Finalização
  passing: number; // Passe
  dribbling: number; // Drible
  defending: number; // Defesa
  physical: number; // Físico
}

export type Position =
  | "GK" // Goleiro
  | "DEF" // Defensor
  | "MID" // Meio-campo
  | "ATT"; // Atacante

export interface Team {
  id: string;
  name: string;
  players: Player[];
  averageRating: number;
  formation?: string;
}

export interface Match {
  id: string;
  date: Date;
  teams: [Team, Team];
  status: "scheduled" | "ongoing" | "finished";
  score?: [number, number];
}

// Cores dos cards por posição (inspirado no FIFA)
export const POSITION_COLORS = {
  GK: {
    primary: "#FFA500", // Laranja
    secondary: "#FF8C00",
    gradient: "from-orange-500 to-orange-600",
  },
  DEF: {
    primary: "#4169E1", // Azul
    secondary: "#1E90FF",
    gradient: "from-blue-500 to-blue-600",
  },
  MID: {
    primary: "#4169E1", // Azul
    secondary: "#1E90FF",
    gradient: "from-blue-500 to-blue-600",
  },
  ATT: {
    primary: "#4169E1", // Azul
    secondary: "#1E90FF",
    gradient: "from-blue-500 to-blue-600",
  },
} as const;

// Utilitário para calcular overall baseado nos atributos
export function calculateOverall(attributes: PlayerAttributes, position: Position): number {
  const weights = {
    GK: { pace: 0.1, shooting: 0.1, passing: 0.2, dribbling: 0.1, defending: 0.3, physical: 0.2 },
    DEF: { pace: 0.15, shooting: 0.05, passing: 0.2, dribbling: 0.1, defending: 0.35, physical: 0.15 },
    MID: { pace: 0.15, shooting: 0.2, passing: 0.3, dribbling: 0.2, defending: 0.1, physical: 0.05 },
    ATT: { pace: 0.2, shooting: 0.35, passing: 0.15, dribbling: 0.25, defending: 0.02, physical: 0.03 },
  };

  const positionWeights = weights[position];

  return Math.round(
    attributes.pace * positionWeights.pace +
      attributes.shooting * positionWeights.shooting +
      attributes.passing * positionWeights.passing +
      attributes.dribbling * positionWeights.dribbling +
      attributes.defending * positionWeights.defending +
      attributes.physical * positionWeights.physical
  );
}
