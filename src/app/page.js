"use client";
import { useGameStore } from "../store/gameStore";
import Card from "../components/Card";
import { RefreshCcw, Hand, Ban, Skull, Trophy } from "lucide-react";

export default function Home() {
  const {
    gameStatus,
    players,
    activePlayerIndex,
    roundNumber,
    isProcessing,
    startGame,
    hit,
    stay,
    resetGame,
  } = useGameStore();
  const activePlayer = players[activePlayerIndex];

  if (gameStatus === "LOBBY") {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="space-y-4">
            <div className="inline-block bg-black text-white px-6 py-2 text-sm font-black uppercase tracking-[0.4em]">
              Standard Edition
            </div>
            <h1 className="text-9xl font-black tracking-tighter text-black italic">
              TC FLIP<span className="text-gray-300">7</span>
            </h1>
            <div className="h-1 w-24 bg-black mx-auto"></div>
          </div>

          <div className="space-y-2">
            <p className="text-lg font-bold uppercase tracking-widest text-black">
              Objective: 200 Points
            </p>
            <div className="pt-4">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em]">
                Created by Mohamad Youssef & Majid Mina
              </p>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => startGame(["Player", "Dealer"])}
              className="group relative w-full py-5 bg-black text-white text-xl font-bold uppercase tracking-widest transition-all hover:bg-gray-900 active:scale-[0.98]"
            >
              <span>Initialize Game</span>
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-black group-hover:top-0 group-hover:left-0 transition-all"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-black group-hover:bottom-0 group-hover:right-0 transition-all"></div>
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (gameStatus === "GAME_OVER") {
    const winner = [...players].sort(
      (a, b) => b.bankedScore - a.bankedScore,
    )[0];

    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full border-t-8 border-black pt-12 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="space-y-2">
            <Trophy
              size={48}
              className="mx-auto text-black mb-4"
              strokeWidth={1.5}
            />
            <h1 className="text-sm font-black uppercase tracking-[0.4em] text-gray-400">
              Final Results
            </h1>
            <h2 className="text-6xl font-black italic tracking-tighter text-black">
              {winner.name}
            </h2>
          </div>

          <div className="py-8 border-y border-gray-100 flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
              Banked Points
            </span>
            <span className="text-8xl font-black tracking-tighter text-black">
              {winner.bankedScore}
            </span>
          </div>

          <button
            onClick={resetGame}
            className="group relative w-full py-5 bg-black text-white text-xl font-bold uppercase tracking-widest transition-all hover:bg-gray-800 active:scale-95"
          >
            New Session
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-black group-hover:top-0 group-hover:left-0 transition-all"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-black group-hover:bottom-0 group-hover:right-0 transition-all"></div>
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black flex flex-col font-sans antialiased">
      <header className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-black italic tracking-tighter">
            FLIP<span className="text-gray-300">7</span>
          </h1>
          <div className="h-6 w-[1px] bg-gray-200"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 pt-1">
            Round {roundNumber || 1}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 block">
              Active Subject
            </span>
            <span className="text-sm font-black uppercase tracking-widest">
              {activePlayer?.name}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          {players.map((p, i) => {
            const isActive = i === activePlayerIndex;
            return (
              <div
                key={p.id}
                className={`
                  relative p-8 transition-all duration-500 border-l-2
                  ${
                    isActive
                      ? "border-black bg-white"
                      : "border-gray-100 bg-transparent opacity-40 grayscale pointer-events-none"
                  }
                `}
              >
                {p.status === "BUSTED" && (
                  <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
                    <div className="border-2 border-black px-6 py-4 bg-white text-center">
                      <span className="text-sm font-black uppercase tracking-[0.4em]">
                        BUSTED
                      </span>
                    </div>
                  </div>
                )}
                {p.status === "WON_ROUND" && (
                  <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
                    <div className="bg-black text-white px-6 py-4 text-center">
                      <span className="text-sm font-black uppercase tracking-[0.4em]">
                        Flip 7 Success
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-end mb-10">
                  <div className="space-y-1">
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase">
                      {p.name}
                    </h2>
                    <div className="flex gap-2">
                      {p.isFrozen && (
                        <span className="text-[8px] font-bold border border-black px-2 py-0.5 uppercase tracking-widest">
                          Frozen
                        </span>
                      )}
                      {p.secondChances > 0 && (
                        <span className="text-[8px] font-bold bg-black text-white px-2 py-0.5 uppercase tracking-widest">
                          2nd Chance
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">
                      Banked
                    </span>
                    <span className="text-5xl font-black tracking-tighter">
                      {p.bankedScore}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 min-h-[200px]">
                  {p.hand.length === 0 && p.isActive && (
                    <div className="w-full flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">
                      [ Awaiting Data ]
                    </div>
                  )}
                  {p.hand.map((card, idx) => (
                    <div
                      key={card.id}
                      className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <Card card={card} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border-t border-gray-100 p-8 z-30">
        <div className="max-w-2xl mx-auto flex items-center gap-8">
          <button
            onClick={hit}
            disabled={!activePlayer?.isActive || isProcessing}
            className="flex-1 py-6 bg-black text-white text-xs font-black uppercase tracking-[0.5em] transition-all hover:bg-gray-800 disabled:opacity-20 active:scale-95"
          >
            Hit
          </button>

          <button
            onClick={stay}
            disabled={!activePlayer?.isActive || isProcessing}
            className="flex-1 py-6 border-2 border-black text-black text-xs font-black uppercase tracking-[0.5em] transition-all hover:bg-gray-50 disabled:opacity-20 active:scale-95"
          >
            Stand
          </button>

          <button
            onClick={resetGame}
            className="p-6 text-gray-300 hover:text-black transition-colors"
            title="Reset Session"
          ></button>
        </div>
      </div>
    </main>
  );
}
