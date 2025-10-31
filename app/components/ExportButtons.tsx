import { useState } from "react";
import { Team } from "../types/player";

interface ExportButtonsProps {
  teams: [Team, Team] | null;
  className?: string;
}

export default function ExportButtons({ teams, className = "" }: ExportButtonsProps) {
  const [isCopied, setIsCopied] = useState(false);

  const generateWhatsAppText = () => {
    // Verifica se teams é válido
    if (!teams) {
      console.error("Teams data is null or undefined");
      return "Erro: dados dos times não encontrados.";
    }

    const [team1, team2] = teams;

    let text = "";

    text += `⚪ *${team1.name}* (Overall: ${team1.averageRating})\n`;
    team1.players.forEach((player) => {
      text += `- ${player.name} (${player.overall})\n`;
    });

    text += "\n";

    text += `⚫ *${team2.name}* (Overall: ${team2.averageRating})\n`;
    team2.players.forEach((player) => {
      text += `- ${player.name} (${player.overall})\n`;
    });

    return text;
  };

  const handleCopyToWhatsApp = async () => {
    try {
      const text = generateWhatsAppText();
      await navigator.clipboard.writeText(text);

      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Remove o feedback após 2 segundos
    } catch (error) {
      console.error("Erro ao copiar texto:", error);
      alert("Erro ao copiar texto. Tente novamente.");
    }
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <button
        onClick={handleCopyToWhatsApp}
        disabled={!teams}
        className={`${
          !teams
            ? "bg-gray-500 cursor-not-allowed"
            : isCopied
            ? "bg-green-600 hover:bg-green-700"
            : "bg-emerald-600 hover:bg-emerald-700"
        } text-white font-semibold px-4 sm:px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg`}
      >
        <span className="text-lg">{!teams ? "🚫" : isCopied ? "✅" : "📱"}</span>
        <span>{!teams ? "Gere os times primeiro" : isCopied ? "Copiado!" : "Copiar para WhatsApp"}</span>
      </button>
    </div>
  );
}
