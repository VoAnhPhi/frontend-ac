import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../app/api';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { Loading } from '../components/ui/Loading';
import {
  leaderboardSize,
  useGetLeaderboardQuery,
  type LeaderboardRow,
} from '../features/leaderboard/leaderboardApi';

// The design highlights one row; it stays at the same rank with live data.
const highlightedRank = 10;

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const compactUsd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
});

// Shown for the 24h change and volume, which DummyJSON has no data for.
const noData = '-';

const chains = ['BNB Chain', 'Base'] as const;

function TokenCell({ row, inverted = false }: { row: LeaderboardRow; inverted?: boolean }) {
  return (
    <div className="flex min-w-[170px] items-center gap-2">
      <img src={row.icon} alt="" className="size-6 shrink-0 rounded-full object-cover" />
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-medium">{row.token}</p>
        <div
          className={`flex items-center gap-1 text-xs ${inverted ? 'text-white/75' : 'text-muted'}`}
        >
          <span className="truncate">{row.sku}</span>
          <Icon name="copy" size={12} className={inverted ? 'text-white/75' : 'text-muted'} />
          {inverted && <Icon name="close" size={10} className="text-white/75" />}
        </div>
      </div>
    </div>
  );
}

export function LeaderboardPage() {
  const [chain, setChain] = useState<(typeof chains)[number]>('BNB Chain');
  const { data: rows, error, isFetching, refetch } = useGetLeaderboardQuery();
  // RTK Query keeps the last error while it retries, so a retry shows as loading.
  const failed = error && !isFetching;
  const topScrollRef = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'ACW3 · Leaderboard';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="min-h-dvh bg-white text-ink">
      <header className="mx-auto flex h-[60px] max-w-[1280px] items-center px-4 sm:px-6 lg:px-8 xl:px-0">
        <Link to="/" className="text-sm font-bold text-brand-dark" aria-label="ACW3 home">
          ACW3
        </Link>
      </header>

      <main className="mx-auto w-full max-w-[1280px] px-4 pb-20 sm:px-6 lg:px-8 xl:px-0">
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

        <section
          className="mt-10 min-w-0 rounded-2xl border border-brand bg-[#f5fbfb] p-3 sm:p-4 lg:p-6"
          aria-labelledby="top-creators-title"
        >
          <div className="flex min-h-8 flex-col items-stretch gap-3 bg-[#f5fbfb] sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <h2
              id="top-creators-title"
              className="flex items-center gap-1.5 text-[18px] leading-6 font-medium"
            >
              <Icon name="leaderboard" size={18} className="text-brand" />
              Top {leaderboardSize} Creators
            </h2>
            <div className="flex w-fit shrink-0 items-center gap-1 self-end rounded-lg bg-white p-0.5 text-sm leading-5 sm:self-auto">
              {chains.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={chain === item}
                  onClick={() => setChain(item)}
                  className={`rounded-lg px-3 py-1 transition-colors ${chain === item ? 'bg-brand text-white' : 'text-ink hover:bg-brand-soft'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          {!rows?.length ? (
            <div className="mt-4 grid min-h-[240px] place-items-center rounded-lg bg-white p-8 text-center">
              {failed ? (
                <div className="space-y-3">
                  <p role="alert" className="text-sm text-red-600">
                    {getErrorMessage(error, 'Could not load the leaderboard.')}
                  </p>
                  <Button type="button" variant="secondary" size="sm" onClick={() => refetch()}>
                    Try again
                  </Button>
                </div>
              ) : rows ? (
                <p className="text-sm text-muted">No tokens found.</p>
              ) : (
                <Loading label="Loading leaderboard" />
              )}
            </div>
          ) : (
            <>
              <div
                ref={topScrollRef}
                role="region"
                aria-label="Scroll leaderboard horizontally"
                tabIndex={0}
                onScroll={(event) => {
                  if (tableScrollRef.current) {
                    tableScrollRef.current.scrollLeft = event.currentTarget.scrollLeft;
                  }
                }}
                className="sticky top-0 z-30 mt-2 h-4 max-w-full overflow-x-auto overflow-y-hidden bg-[#f5fbfb] xl:hidden"
              >
                <div className="h-px w-[980px]" />
              </div>
              <div
                ref={tableScrollRef}
                onScroll={(event) => {
                  if (topScrollRef.current) {
                    topScrollRef.current.scrollLeft = event.currentTarget.scrollLeft;
                  }
                }}
                className="mt-1 max-w-full overflow-x-auto xl:mt-4 xl:overflow-visible"
              >
                <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left text-sm">
                  <caption className="sr-only">
                    Top {leaderboardSize} creators on {chain}
                  </caption>
                  <thead className="text-[#00706e] xl:sticky xl:top-4 xl:z-20">
                    <tr className="h-12">
                      <th
                        scope="col"
                        className="w-[58px] rounded-l-lg border-b border-[#c7dddd] bg-[#d9f1f1] px-3 font-medium"
                      >
                        Rank
                      </th>
                      <th
                        scope="col"
                        className="w-[220px] border-b border-[#c7dddd] bg-[#d9f1f1] px-3 font-medium"
                      >
                        Token
                      </th>
                      <th
                        scope="col"
                        className="w-[180px] border-b border-[#c7dddd] bg-[#d9f1f1] px-3 font-medium"
                      >
                        Creator
                      </th>
                      <th
                        scope="col"
                        className="w-[140px] border-b border-[#c7dddd] bg-[#d9f1f1] px-3 font-medium"
                      >
                        24h Chg
                      </th>
                      <th
                        scope="col"
                        className="w-[150px] border-b border-[#c7dddd] bg-[#d9f1f1] px-3 font-medium"
                      >
                        Market Cap
                      </th>
                      <th
                        scope="col"
                        className="w-[150px] border-b border-[#c7dddd] bg-[#d9f1f1] px-3 font-medium"
                      >
                        Volume (24h)
                      </th>
                      <th
                        scope="col"
                        className="w-[140px] rounded-r-lg border-b border-[#c7dddd] bg-[#d9f1f1] px-3 font-medium"
                      >
                        Token Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const highlighted = row.rank === highlightedRank;
                      const surface = highlighted
                        ? 'bg-brand group-hover:bg-[#00a39e]'
                        : 'border-b border-[#e4e8e8] bg-transparent group-hover:bg-brand-soft';
                      const missing = highlighted ? 'text-white/75' : 'text-muted';

                      return (
                        <tr
                          key={row.rank}
                          className={`group h-[54px] transition-colors duration-150 ${highlighted ? 'text-white' : ''}`}
                        >
                          <td
                            className={`${highlighted ? 'rounded-l-lg' : ''} px-3 font-medium transition-colors ${surface} ${highlighted ? 'text-white' : 'text-muted'}`}
                          >
                            #{row.rank}
                          </td>
                          <td className={`px-3 transition-colors ${surface}`}>
                            <TokenCell row={row} inverted={highlighted} />
                          </td>
                          <td className={`px-3 transition-colors ${surface}`}>
                            {row.creator ?? 'N/A'}
                          </td>
                          <td className={`px-3 transition-colors ${surface} ${missing}`}>
                            {noData}
                          </td>
                          <td className={`px-3 transition-colors ${surface}`}>
                            {row.marketCap === undefined
                              ? noData
                              : compactUsd.format(row.marketCap)}
                          </td>
                          <td className={`px-3 transition-colors ${surface} ${missing}`}>
                            {noData}
                          </td>
                          <td
                            className={`${highlighted ? 'rounded-r-lg' : ''} px-3 transition-colors ${surface}`}
                          >
                            {row.price === undefined ? noData : usd.format(row.price)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
