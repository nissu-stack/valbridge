type HomeOriginMarqueeProps = {
  featuredOrigins: string[];
};

export function HomeOriginMarquee({ featuredOrigins }: HomeOriginMarqueeProps) {
  return (
    <div className="mt-8 overflow-hidden rounded-[18px] border border-[var(--line)] bg-[var(--panel2)] py-4">
      <div className="flex w-max animate-[marquee_26s_linear_infinite] gap-14 whitespace-nowrap text-sm text-[var(--text-dim)]">
        {featuredOrigins.concat(featuredOrigins).map((origin, index) => (
          <span key={`${origin}-${index}`} className="flex items-center gap-3 font-[Fraunces] text-[15px]">
            <b className="font-normal text-[var(--gold-bright)]">{origin.split(" · ")[0]}</b>
            <span className="text-[var(--text-dim)]">{origin.split(" · ")[1]}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
