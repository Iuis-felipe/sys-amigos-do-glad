import { useState } from "react";
import Image from "next/image";
import { Player, Team } from "../types/player";
import { generateBalancedTeams, TeamGenerationOptions } from "../utils/teamGenerator";
import PlayerCard from "./PlayerCard";
import ExportButtons from "./ExportButtons";

interface MatchCreatorProps {
  allPlayers: Player[];
}

export default function MatchCreator({ allPlayers }: MatchCreatorProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [generatedTeams, setGeneratedTeams] = useState<[Team, Team] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [playersPerTeam, setPlayersPerTeam] = useState<7 | 7.5 | 8>(7);

  const handlePlayerToggle = (player: Player) => {
    setSelectedPlayers((prev) => {
      const isSelected = prev.some((p) => p.id === player.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== player.id);
      } else {
        if (prev.length >= playersPerTeam * 2) {
          return prev; // Não adiciona se já atingiu o limite
        }
        return [...prev, player];
      }
    });
  };

  const handleSelectAll = () => {
    const maxPlayers = playersPerTeam === 7.5 ? 15 : playersPerTeam * 2;
    const shuffled = [...allPlayers].sort(() => Math.random() - 0.5);
    setSelectedPlayers(shuffled.slice(0, maxPlayers));
  };

  const handleClearSelection = () => {
    setSelectedPlayers([]);
    setGeneratedTeams(null);
  };

  const handleGenerateTeams = async () => {
    if (selectedPlayers.length < playersPerTeam * 2) {
      alert(`Selecione ${playersPerTeam * 2} jogadores para gerar os times.`);
      return;
    }

    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const options: TeamGenerationOptions = {
        playersPerTeam: playersPerTeam === 7.5 ? 7 : playersPerTeam,
        balanceStrategy: "mixed",
      };

      const teams = generateBalancedTeams(selectedPlayers, options);
      setGeneratedTeams(teams);
    } catch (error) {
      console.error("Erro ao gerar times:", error);
      alert("Erro ao gerar times. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateTeams = () => {
    setGeneratedTeams(null);
    handleGenerateTeams();
  };

  const isPlayerSelected = (player: Player) => selectedPlayers.some((p) => p.id === player.id);
  const maxPlayers = playersPerTeam === 7.5 ? 15 : playersPerTeam * 2;

  return (
    <div className="space-y-8">
      {/* Controles de Seleção */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        {/* Header dos controles */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Criar Nova Partida</h3>
            <p className="text-slate-400 text-sm sm:text-base">
              Selecione {maxPlayers} jogadores para gerar times balanceados
            </p>
          </div>

          {/* Seletor de formato */}
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-4">
            <label className="text-white font-medium text-sm sm:text-base">Formato:</label>
            <select
              value={playersPerTeam}
              onChange={(e) => {
                const newSize = Number(e.target.value) as 7 | 7.5 | 8;
                setPlayersPerTeam(newSize);
                setSelectedPlayers([]);
                setGeneratedTeams(null);
              }}
              className="bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-green-400 transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              <option value={7}>7 vs 7 (14 jogadores)</option>
              <option value={7.5}>7 vs 8 (15 jogadores)</option>
              <option value={8}>8 vs 8 (16 jogadores)</option>
            </select>
          </div>
        </div>

        {/* Indicador de progresso */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1">
            <span className="text-xs sm:text-sm font-medium text-slate-300">
              Jogadores selecionados: {selectedPlayers.length}/{maxPlayers}
            </span>
            <span className="text-xs sm:text-sm text-slate-400">
              {selectedPlayers.length > 0 &&
                `Média: ${Math.round(selectedPlayers.reduce((acc, p) => acc + p.overall, 0) / selectedPlayers.length)}`}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-linear-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(selectedPlayers.length / maxPlayers) * 100}%` }}
            />
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-col xs:flex-row gap-3 flex-1">
            <button
              onClick={handleSelectAll}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <span className="xs:inline">Seleção aleatória</span>
            </button>

            <button
              onClick={handleClearSelection}
              className="bg-slate-600 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <span className="xs:inline">Limpar seleção</span>
            </button>
          </div>

          {!generatedTeams ? (
            <button
              onClick={handleGenerateTeams}
              disabled={selectedPlayers.length !== maxPlayers || isGenerating}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Gerando...
                </>
              ) : (
                <>⚡ Gerar Times</>
              )}
            </button>
          ) : (
            <div className="flex gap-3 ml-auto">
              <button
                onClick={handleRegenerateTeams}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition-colors"
              >
                Gerar Novamente
              </button>
              <button
                onClick={() => setGeneratedTeams(null)}
                className="bg-slate-600 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-lg transition-colors"
              >
                Editar Seleção
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Times Gerados */}
      {generatedTeams && (
        <div
          className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
          id="teams-generated"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/logos/amigos-do-glad.png"
                alt="Logo"
                width={64}
                height={64}
                className="w-16 h-16 rounded-xl"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Times Gerados</h2>
            <div className="flex flex-col gap-3 sm:gap-4 text-sm sm:text-lg">
              <div className="bg-slate-100/10 border border-slate-300/50 rounded-lg px-3 sm:px-6 py-2 sm:py-3 flex flex-col xs:flex-row items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                  <span className="text-slate-200 font-semibold text-center">{generatedTeams[0].name}</span>
                </div>
                <span className="text-white text-xs sm:text-sm">Overall: {generatedTeams[0].averageRating}</span>
              </div>
              <div className="text-white font-bold text-lg sm:text-xl text-center">VS</div>
              <div className="bg-slate-800/20 border border-slate-600/50 rounded-lg px-3 sm:px-6 py-2 sm:py-3 flex flex-col xs:flex-row items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                  <span className="text-slate-300 font-semibold text-center">{generatedTeams[1].name}</span>
                </div>
                <span className="text-white text-xs sm:text-sm">Overall: {generatedTeams[1].averageRating}</span>
              </div>
            </div>
            <div className="mt-2 text-xs sm:text-sm text-slate-400">
              Diferença de Overall: {Math.abs(generatedTeams[0].averageRating - generatedTeams[1].averageRating)}
            </div>
          </div>

          {/* Botões de Exportação */}
          <div className="mb-8 no-print">
            <ExportButtons teams={generatedTeams} className="mb-4" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Time Branco */}
            <div className="bg-slate-100/10 border border-slate-300/30 rounded-xl p-4">
              <h3 className="text-xl font-bold text-slate-200 mb-4 text-center">⚪ {generatedTeams[0].name}</h3>
              <div className="grid lg:grid-cols-2 gap-2 py-8">
                {generatedTeams[0].players.map((player) => (
                  <div key={player.id} className="flex justify-center content-center my-2">
                    <PlayerCard player={player} />
                  </div>
                ))}
              </div>
            </div>

            {/* Time Preto */}
            <div className="bg-slate-800/20 border border-slate-600/30 rounded-xl p-4">
              <h3 className="text-xl font-bold text-slate-100 mb-4 text-center">⚫ {generatedTeams[1].name}</h3>
              <div className="grid lg:grid-cols-2 gap-2 py-8">
                {generatedTeams[1].players.map((player) => (
                  <div key={player.id} className="flex justify-center content-center my-2">
                    <PlayerCard player={player} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seleção de Jogadores */}
      {!generatedTeams && (
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Selecione os Jogadores da Partida</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
            {allPlayers.map((player) => (
              <div
                key={player.id}
                className={`relative transition-all duration-300 cursor-pointer ${
                  isPlayerSelected(player)
                    ? "ring-4 ring-green-400/50 shadow-lg scale-105"
                    : "hover:scale-102 opacity-75 hover:opacity-100"
                } ${
                  !isPlayerSelected(player) && selectedPlayers.length >= maxPlayers
                    ? "opacity-30 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => handlePlayerToggle(player)}
              >
                <PlayerCard player={player} />

                {/* Indicador de seleção */}
                {isPlayerSelected(player) && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg">
                    ✓
                  </div>
                )}

                {/* Overlay para jogadores não selecionáveis */}
                {!isPlayerSelected(player) && selectedPlayers.length >= maxPlayers && (
                  <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold">Limite atingido</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
