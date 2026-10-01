import { Icon } from '../../components/ui/Icon';

// The stats are design values: DummyJSON has no market data.
export function LeaderboardHero() {
  return (
    <section className="flex flex-col items-center pt-10 text-center sm:pt-12">
      <h1 className="text-3xl font-medium tracking-[-0.03em] sm:text-[40px] sm:leading-[1.2]">
        ACW3 Leaderboard
      </h1>
      <p className="mt-1 text-xs sm:text-sm">
        Discover the top cults on <span className="text-brand">ACW3</span>
      </p>

      <a
        href="https://x.com/"
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex h-8 items-center gap-2 rounded-md border border-brand px-3 text-xs font-medium text-brand-dark transition-colors hover:bg-brand-soft"
      >
        <Icon name="twitter" size={15} />
        Made by ACW3
      </a>

      <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full bg-brand px-4 py-2 text-center text-sm font-medium text-white sm:px-5">
        <span>
          This dashboard has been coined&nbsp; <strong className="font-bold">ACW3</strong>
        </span>
        <Icon name="copy" size={15} />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] sm:gap-x-7 sm:text-xs">
        <span>
          <strong className="font-bold">MC:</strong> $162.77K
        </span>
        <span className="text-[#ed8b99]">
          <strong className="font-bold">1h:</strong> -3.34%
        </span>
        <span>
          <strong className="font-bold">24h Vol:</strong> $8.55K
        </span>
      </div>
    </section>
  );
}
