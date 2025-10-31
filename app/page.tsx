"use client";

import { useState } from "react";
import Logo from "./components/Logo";
import Navigation from "./components/Navigation";
import PlayersView from "./components/PlayersView";
import MatchCreator from "./components/MatchCreator";
import { mockPlayers } from "./data/mockPlayers";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"players" | "match">("players");

  const renderContent = () => {
    switch (activeTab) {
      case "players":
        return <PlayersView players={mockPlayers} />;
      case "match":
        return <MatchCreator allPlayers={mockPlayers} />;
      default:
        return <PlayersView players={mockPlayers} />;
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="text-center py-6 sm:py-8 px-4"></div>

      {/* Navigation */}
      <div className="px-4">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Content */}
      <div className="px-4 pb-8">{renderContent()}</div>

      {/* Footer */}
      <footer className="text-center py-8 mt-12 border-t border-slate-700/50">
        <div className="flex flex-col items-center gap-4">
          <Logo size="small" />
          <p className="text-slate-400">
            Sistema Amigos do Glad - Desenvolvido pelo Figueira
          </p>
          <p className="text-slate-500 text-sm">Amigos do Glad FC © 2025</p>
        </div>
      </footer>
    </main>
  );
}
