interface TimeRangeSelectorProps {
  ranges: string[];
  selected: string;
  onSelect: (range: string) => void;
}

export function TimeRangeSelector({ ranges, selected, onSelect }: TimeRangeSelectorProps) {
  return (
    <div className="flex items-center gap-0.5">
      {ranges.map((range) => (
        <button
          key={range}
          onClick={() => onSelect(range)}
          className={`px-2 py-0.5 text-xxs font-medium rounded transition-colors ${
            selected === range
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  );
}
