export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-champagne-hover uppercase mb-2">
      <span className="w-5 h-[1.5px] bg-champagne inline-block" aria-hidden="true" />
      {children}
    </span>
  );
}
