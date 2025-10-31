import { Player, Team } from "../types/player";

export interface TeamGenerationOptions {
  playersPerTeam: number;
  balanceStrategy: "overall" | "position" | "mixed";
  enforcePositions?: boolean;
}

export function generateBalancedTeams(
  players: Player[],
  options: TeamGenerationOptions = { playersPerTeam: 7, balanceStrategy: "overall" }
): [Team, Team] {
  const { playersPerTeam, balanceStrategy } = options;

  if (players.length < playersPerTeam * 2) {
    throw new Error(`Não há jogadores suficientes. Necessário: ${playersPerTeam * 2}, Disponível: ${players.length}`);
  }

  // Separar goleiros dos outros jogadores
  const goalkeepers = players.filter(player => player.position === "GK");
  
  // Embaralha os jogadores para evitar padrões
  const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);

  let team1: Player[] = [];
  let team2: Player[] = [];

  // Lógica especial para goleiros
  if (goalkeepers.length === 2) {
    // Se há 2 goleiros, um vai para cada time
    team1.push(goalkeepers[0]);
    team2.push(goalkeepers[1]);
  } else if (goalkeepers.length === 1 && players.length !== 15) {
    // Se há apenas 1 goleiro e não são 15 jogadores, vai para o time 1
    team1.push(goalkeepers[0]);
  }

  // Jogadores restantes (excluindo goleiros já distribuídos)
  const playersToDistribute = shuffledPlayers.filter(player => {
    if (goalkeepers.length === 2) {
      return !goalkeepers.includes(player);
    } else if (goalkeepers.length === 1 && players.length !== 15) {
      return player !== goalkeepers[0];
    }
    return true;
  });

  if (balanceStrategy === "overall") {
    // Estratégia por overall rating
    const sortedPlayers = playersToDistribute.sort((a, b) => b.overall - a.overall);

    // Distribui alternadamente (serpentina) para balancear
    const totalPlayersToDistribute = Math.min(sortedPlayers.length, (playersPerTeam * 2) - team1.length - team2.length);
    
    for (let i = 0; i < totalPlayersToDistribute; i++) {
      if (i % 4 < 2) {
        if (team1.length < playersPerTeam) {
          team1.push(sortedPlayers[i]);
        } else {
          team2.push(sortedPlayers[i]);
        }
      } else {
        if (team2.length < playersPerTeam) {
          team2.push(sortedPlayers[i]);
        } else {
          team1.push(sortedPlayers[i]);
        }
      }
    }
  } else if (balanceStrategy === "position") {
    // Estratégia por posição
    const playersByPosition = groupPlayersByPosition(playersToDistribute);

    // Distribui jogadores por posição de forma balanceada
    const positions: (keyof typeof playersByPosition)[] = ["GK", "DEF", "MID", "ATT"];

    for (const position of positions) {
      const positionPlayers = playersByPosition[position];
      for (let i = 0; i < positionPlayers.length && team1.length + team2.length < playersPerTeam * 2; i++) {
        if (i % 2 === 0 && team1.length < playersPerTeam) {
          team1.push(positionPlayers[i]);
        } else if (team2.length < playersPerTeam) {
          team2.push(positionPlayers[i]);
        } else if (team1.length < playersPerTeam) {
          team1.push(positionPlayers[i]);
        }
      }
    }
  } else {
    // Estratégia mista (considera posição e overall)
    team1 = [];
    team2 = [];

    // Implementa um algoritmo guloso para balancear tanto overall quanto posições
    const availablePlayers = [...playersToDistribute];

    while ((team1.length < playersPerTeam || team2.length < playersPerTeam) && availablePlayers.length > 0) {
      const team1Avg = calculateTeamAverage(team1);
      const team2Avg = calculateTeamAverage(team2);

      // Escolhe o próximo jogador baseado no que mais balanceia os times
      let bestPlayerIndex = 0;
      let bestScore = -1;

      for (let i = 0; i < availablePlayers.length; i++) {
        const player = availablePlayers[i];
        const scoreForTeam1 = calculateBalanceScore(team1, player, team2Avg);
        const scoreForTeam2 = calculateBalanceScore(team2, player, team1Avg);

        const score = Math.max(scoreForTeam1, scoreForTeam2);
        if (score > bestScore) {
          bestScore = score;
          bestPlayerIndex = i;
        }
      }

      const selectedPlayer = availablePlayers.splice(bestPlayerIndex, 1)[0];

      // Decide em qual time colocar o jogador
      if (team1.length >= playersPerTeam) {
        team2.push(selectedPlayer);
      } else if (team2.length >= playersPerTeam) {
        team1.push(selectedPlayer);
      } else if (team1.length === team2.length) {
        if (team1Avg <= team2Avg) {
          team1.push(selectedPlayer);
        } else {
          team2.push(selectedPlayer);
        }
      } else if (team1.length < team2.length) {
        team1.push(selectedPlayer);
      } else {
        team2.push(selectedPlayer);
      }
    }
  }

  // Lógica especial para 15 jogadores com 1 goleiro
  if (players.length === 15 && goalkeepers.length === 1) {
    // O goleiro vai para o time com menos jogadores
    if (team1.length < team2.length) {
      team1.push(goalkeepers[0]);
    } else if (team2.length < team1.length) {
      team2.push(goalkeepers[0]);
    } else {
      // Se estão iguais, adiciona ao team1
      team1.push(goalkeepers[0]);
    }
  }

  // Para casos de 15 jogadores, distribui um jogador a mais para equilibrar
  if (players.length === 15) {
    // Verifica se os times estão com 7 cada (sem contar possível goleiro já adicionado)
    const total = team1.length + team2.length;
    if (total === 14) {
      // Adiciona o 15º jogador ao time com menor average rating
      const lastPlayer = players.find(p => !team1.includes(p) && !team2.includes(p));
      if (lastPlayer) {
        const team1Avg = calculateTeamAverage(team1);
        const team2Avg = calculateTeamAverage(team2);
        
        if (team1Avg <= team2Avg) {
          team1.push(lastPlayer);
        } else {
          team2.push(lastPlayer);
        }
      }
    }
  }

  // Cria os objetos Team
  const teamA: Team = {
    id: "team-a",
    name: "Time Branco",
    players: team1,
    averageRating: calculateTeamAverage(team1),
  };

  const teamB: Team = {
    id: "team-b",
    name: "Time Preto",
    players: team2,
    averageRating: calculateTeamAverage(team2),
  };

  return [teamA, teamB];
}

function groupPlayersByPosition(players: Player[]) {
  return players.reduce((acc, player) => {
    if (!acc[player.position]) {
      acc[player.position] = [];
    }
    acc[player.position].push(player);
    return acc;
  }, {} as Record<string, Player[]>);
}

function calculateTeamAverage(players: Player[]): number {
  if (players.length === 0) return 0;
  const total = players.reduce((sum, player) => sum + player.overall, 0);
  return Math.round(total / players.length);
}

function calculateBalanceScore(team: Player[], newPlayer: Player, oppositeTeamAvg: number): number {
  const newTeam = [...team, newPlayer];
  const newAvg = calculateTeamAverage(newTeam);

  // Pontuação baseada em quão próximo fica da média do time adversário
  const avgDifference = Math.abs(newAvg - oppositeTeamAvg);
  const positionBalance = getPositionBalance(newTeam);

  // Quanto menor a diferença de overall e melhor o balance de posições, melhor a pontuação
  return 100 - avgDifference + positionBalance;
}

function getPositionBalance(players: Player[]): number {
  const positions = groupPlayersByPosition(players);
  const positionCounts = {
    GK: positions.GK?.length || 0,
    DEF: positions.DEF?.length || 0,
    MID: positions.MID?.length || 0,
    ATT: positions.ATT?.length || 0,
  };

  // Ideal seria ter pelo menos 1 GK, 2-3 DEF, 2-3 MID, 1-2 ATT
  const idealDistribution = { GK: 1, DEF: 2.5, MID: 2.5, ATT: 1.5 };

  let balance = 0;
  for (const pos in positionCounts) {
    const actual = positionCounts[pos as keyof typeof positionCounts];
    const ideal = idealDistribution[pos as keyof typeof idealDistribution];
    balance += Math.max(0, 10 - Math.abs(actual - ideal) * 3);
  }

  return balance;
}

// Função utilitária para simular um draft
export function draftTeams(players: Player[], captains: [Player, Player]): [Team, Team] {
  const availablePlayers = players.filter((p) => !captains.includes(p));
  const [captain1, captain2] = captains;

  const team1 = [captain1];
  const team2 = [captain2];

  // Alternadamente, cada "capitão" escolhe o melhor jogador disponível
  let turn = 0; // 0 para team1, 1 para team2

  while (availablePlayers.length > 0 && (team1.length < 7 || team2.length < 7)) {
    // Simula escolha do melhor jogador disponível para balancear o time
    const currentTeam = turn === 0 ? team1 : team2;
    const currentAvg = calculateTeamAverage(currentTeam);

    // Ordena jogadores por quão bem eles se encaixariam no time atual
    availablePlayers.sort((a, b) => {
      const scoreA = calculateBalanceScore(currentTeam, a, currentAvg);
      const scoreB = calculateBalanceScore(currentTeam, b, currentAvg);
      return scoreB - scoreA;
    });

    const chosenPlayer = availablePlayers.shift()!;

    if (turn === 0 && team1.length < 7) {
      team1.push(chosenPlayer);
    } else if (turn === 1 && team2.length < 7) {
      team2.push(chosenPlayer);
    }

    turn = 1 - turn; // Alterna entre 0 e 1
  }

  return [
    {
      id: "team-1",
      name: `Time do ${captain1.name}`,
      players: team1,
      averageRating: calculateTeamAverage(team1),
    },
    {
      id: "team-2",
      name: `Time do ${captain2.name}`,
      players: team2,
      averageRating: calculateTeamAverage(team2),
    },
  ];
}
