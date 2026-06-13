interface ConversationStartersProps {
  /** Localized "Try asking" label (rendered uppercase). */
  label: string;
  starters: string[];
  disabled: boolean;
  onSelect: (starter: string) => void;
}

export function ConversationStarters({
  label,
  starters,
  disabled,
  onSelect,
}: ConversationStartersProps) {
  if (starters.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium uppercase tracking-wider text-df-green-dark">
        {label}
      </p>
      <div className="flex flex-col gap-2">
        {starters.map((starter, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(starter)}
            disabled={disabled}
            className="starter-pill rounded-full bg-df-green-dark px-4 py-2 text-left text-sm font-medium text-white transition hover:bg-df-green-mid/85 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {starter}
          </button>
        ))}
      </div>
    </div>
  );
}
