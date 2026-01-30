import { Zap, Repeat, Snowflake } from "lucide-react";

export default function Card({ card }) {
  const renderIcon = () => {
    if (card.action === "FREEZE")
      return <Snowflake size={24} strokeWidth={2.5} />;
    if (card.action === "SECOND_CHANCE")
      return <Repeat size={24} strokeWidth={2.5} />;
    if (card.action === "FLIP_THREE")
      return <Zap size={24} strokeWidth={2.5} />;
    return null;
  };

  return (
    <div
      className={`
      relative w-24 h-36 bg-paper border-3 border-ink shadow-hard transition-transform hover:-translate-y-1
      flex flex-col items-center justify-center select-none font-mono text-ink
    `}
    >
      <span className="absolute top-2 left-2 text-sm font-bold">
        {card.label.replace("+", "")}
      </span>

      <div className="flex flex-col items-center gap-2">
        {card.type === "ACTION" ? (
          <>
            {renderIcon()}
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {card.label}
            </span>
          </>
        ) : (
          <span className="text-5xl font-bold tracking-tighter">
            {card.label.replace("+", "")}
          </span>
        )}
      </div>

      <span className="absolute bottom-2 right-2 text-sm font-bold rotate-180">
        {card.label.replace("+", "")}
      </span>

      <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-ink"></div>
      <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-ink"></div>
    </div>
  );
}
