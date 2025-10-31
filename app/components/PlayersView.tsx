import { useState } from 'react';
import { Player, Position } from '../types/player';
import PlayerCard from './PlayerCard';

interface PlayersViewProps {
  players: Player[];
}

export default function PlayersView({ players }: PlayersViewProps) {
  const [filterPosition, setFilterPosition] = useState<Position | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'overall' | 'position'>('overall');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar jogadores
  const filteredPlayers = players.filter(player => {
    const matchesPosition = filterPosition === 'ALL' || player.position === filterPosition;
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPosition && matchesSearch;
  });

  // Ordenar jogadores
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'overall':
        return b.overall - a.overall;
      case 'position':
        return a.position.localeCompare(b.position);
      default:
        return 0;
    }
  });

  // Estatísticas
  const averageOverall = Math.round(players.reduce((acc, p) => acc + p.overall, 0) / players.length);
  const positionCounts = players.reduce((acc, player) => {
    acc[player.position] = (acc[player.position] || 0) + 1;
    return acc;
  }, {} as Record<Position, number>);

  const positionOptions: { value: Position | 'ALL', label: string }[] = [
    { value: 'ALL', label: 'Todos'},
    { value: 'GK', label: 'Goleiros'},
    { value: 'DEF', label: 'Defensores'},
    { value: 'MID', label: 'Meio-campo'},
    { value: 'ATT', label: 'Atacantes'}
  ];

  return (
    <div className="space-y-8">
      {/* Header com estatísticas */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-slate-700/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-400">{players.length}</div>
            <div className="text-slate-300 text-xs sm:text-sm font-medium">Total de Jogadores</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-400">{averageOverall}</div>
            <div className="text-slate-300 text-xs sm:text-sm font-medium">Overall Médio</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-400">{Math.floor(players.length / 14)}</div>
            <div className="text-slate-300 text-xs sm:text-sm font-medium">Partidas Possíveis</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-orange-400">{Math.max(...players.map(p => p.overall))}</div>
            <div className="text-slate-300 text-xs sm:text-sm font-medium">Maior Overall</div>
          </div>
        </div>    
      </div>

      {/* Controles de filtro e busca */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-slate-700/50">
        <div className="flex flex-col gap-4">
          {/* Busca */}
          <div className="w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-400">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Buscar jogador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Filtros e ordenação */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Filtro por posição */}
            <div className="flex flex-wrap gap-2">
              {positionOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilterPosition(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  filterPosition === option.value
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white'
                }`}
              >
                <span>{option.label}</span>
                {option.value !== 'ALL' && (
                  <span className="text-xs opacity-75">({positionCounts[option.value as Position] || 0})</span>
                )}
              </button>
              ))}
            </div>

            {/* Ordenação */}
            <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium whitespace-nowrap">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-green-400 transition-colors"
            >
              <option value="overall">Overall</option>
              <option value="name">Nome</option>
              <option value="position">Posição</option>
            </select>
            </div>
          </div>
        </div>

        {/* Resultados da busca */}
        {searchTerm && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-slate-300">
              Mostrando {sortedPlayers.length} de {players.length} jogadores
              {searchTerm && ` para "${searchTerm}"`}
            </p>
          </div>
        )}
      </div>

      {/* Grade de jogadores */}
      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        {sortedPlayers.length > 0 ? (
          <>
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              {filterPosition === 'ALL' ? 'Todos os Jogadores' : `${positionOptions.find(opt => opt.value === filterPosition)} ${positionOptions.find(opt => opt.value === filterPosition)?.label}`}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {sortedPlayers.map((player, index) => (
                <div 
                  key={player.id} 
                  className="transform transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <PlayerCard player={player} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-white mb-2">Nenhum jogador encontrado</h3>
            <p className="text-slate-400">
              {searchTerm 
                ? `Nenhum jogador corresponde à busca "${searchTerm}"`
                : `Nenhum jogador na posição ${positionOptions.find(opt => opt.value === filterPosition)?.label}`
              }
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterPosition('ALL');
              }}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}