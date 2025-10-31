import Logo from './Logo';

interface NavigationProps {
  activeTab: 'players' | 'match';
  onTabChange: (tab: 'players' | 'match') => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    {
      id: 'players' as const,
      label: 'Jogadores',
      description: 'Ver todos os jogadores'
    },
    {
      id: 'match' as const,
      label: 'Criar Partida',
      description: 'Selecionar jogadores e gerar times'
    }
  ];

  return (
    <nav className="max-w-4xl mx-auto mb-8">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-2 border border-slate-700/50 shadow-2xl">
        {/* Logo pequena na navegação */}
        <div className="flex justify-center pb-3 border-b border-slate-700/50 mb-2">
          <Logo size="small" showText />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 group
                ${activeTab === tab.id
                  ? 'bg-linear-to-r from-green-500/20 to-blue-500/20 text-white border border-green-400/30 shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                }
              `}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
              </span>
              <div className="flex flex-col text-center">
                <span className="text-lg font-bold">{tab.label}</span>
                <span className="text-xs opacity-75">{tab.description}</span>
              </div>
              
              {activeTab === tab.id && (
                <div className="absolute inset-0 rounded-xl bg-linear-to-r from-green-500/10 to-blue-500/10 pointer-events-none"></div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Indicador de tab ativa */}
      <div className="flex justify-center mt-4">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <div
              key={`indicator-${tab.id}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeTab === tab.id ? 'bg-green-400 w-8' : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}