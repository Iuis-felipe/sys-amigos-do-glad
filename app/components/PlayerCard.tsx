import { Player, POSITION_COLORS } from '../types/player';

interface PlayerCardProps {
  player: Player;
  className?: string;
}

export default function PlayerCard({ player, className = '' }: PlayerCardProps) {
  const positionColor = POSITION_COLORS[player.position];
  
  // Função para obter a cor do rating
  const getRatingColor = (rating: number) => {
    if (rating >= 90) return 'text-green-400';
    if (rating >= 80) return 'text-yellow-400';
    if (rating >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  // Função para obter cor do overall
  const getOverallColor = (overall: number) => {
    if (overall >= 85) return 'bg-linear-to-br from-yellow-400 to-yellow-600';
    if (overall >= 80) return 'bg-linear-to-br from-green-400 to-green-600';
    if (overall >= 75) return 'bg-linear-to-br from-blue-400 to-blue-600';
    if (overall >= 70) return 'bg-linear-to-br from-gray-400 to-gray-600';
    return 'bg-linear-to-br from-red-400 to-red-600';
  };

  return (
    <div className={`relative w-72 h-96 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl ${className}`}>
      {/* Background com gradiente da posição */}
      <div className={`absolute inset-0 bg-linear-to-br ${positionColor.gradient}`}>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      {/* Padrão decorativo de fundo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/20 -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/15 translate-y-12 -translate-x-12"></div>
      </div>

      {/* Conteúdo do card */}
      <div className="relative h-full flex flex-col text-white p-6">
        {/* Header com Overall e Posição */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col items-center">
            <div className={`text-3xl font-black ${getOverallColor(player.overall)} bg-clip-text text-transparent`}>
              {player.overall}
            </div>
            <div className="text-sm font-bold bg-black/30 px-2 py-1 rounded">
              {player.position}
            </div>
          </div>
          
          {/* Foto do jogador (placeholder) */}
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
            <div className="text-2xl font-bold text-white">
              {player.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
          </div>
        </div>

        {/* Nome do jogador */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-center text-white drop-shadow-lg">
            {player.name}
          </h3>
          <div className="text-sm text-center text-white/80 mt-1">
            {player.club} • {player.age} anos
          </div>
        </div>

        {/* Atributos */}
        <div className="grid grid-cols-2 gap-3 flex-1">
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-black/20 rounded px-2 py-1">
              <span className="text-xs font-medium">VEL</span>
              <span className={`text-sm font-bold ${getRatingColor(player.attributes.pace)}`}>
                {player.attributes.pace}
              </span>
            </div>
            <div className="flex justify-between items-center bg-black/20 rounded px-2 py-1">
              <span className="text-xs font-medium">FIN</span>
              <span className={`text-sm font-bold ${getRatingColor(player.attributes.shooting)}`}>
                {player.attributes.shooting}
              </span>
            </div>
            <div className="flex justify-between items-center bg-black/20 rounded px-2 py-1">
              <span className="text-xs font-medium">PAS</span>
              <span className={`text-sm font-bold ${getRatingColor(player.attributes.passing)}`}>
                {player.attributes.passing}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-black/20 rounded px-2 py-1">
              <span className="text-xs font-medium">DRI</span>
              <span className={`text-sm font-bold ${getRatingColor(player.attributes.dribbling)}`}>
                {player.attributes.dribbling}
              </span>
            </div>
            <div className="flex justify-between items-center bg-black/20 rounded px-2 py-1">
              <span className="text-xs font-medium">DEF</span>
              <span className={`text-sm font-bold ${getRatingColor(player.attributes.defending)}`}>
                {player.attributes.defending}
              </span>
            </div>
            <div className="flex justify-between items-center bg-black/20 rounded px-2 py-1">
              <span className="text-xs font-medium">FIS</span>
              <span className={`text-sm font-bold ${getRatingColor(player.attributes.physical)}`}>
                {player.attributes.physical}
              </span>
            </div>
          </div>
        </div>

        {/* Footer com nacionalidade */}
        <div className="mt-4 text-center">
          <div className="text-xs text-white/70 bg-black/20 rounded px-2 py-1 inline-block">
            🇧🇷 {player.nationality}
          </div>
        </div>
      </div>

      {/* Borda brilhante */}
      <div className="absolute inset-0 rounded-2xl border-2 border-white/20"></div>
    </div>
  );
}