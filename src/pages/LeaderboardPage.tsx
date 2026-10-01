import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { QueryState } from '../components/ui/QueryState';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { LeaderboardHero } from '../features/leaderboard/LeaderboardHero';
import {
  LeaderboardTable,
  LeaderboardTableSkeleton,
} from '../features/leaderboard/LeaderboardTable';
import { leaderboardSize, useGetLeaderboardQuery } from '../features/leaderboard/leaderboardApi';

const chains = ['BNB Chain', 'Base'] as const;

// Holds the loading, error, and empty states in place of the table.
const statusPanel =
  'mt-4 grid min-h-[240px] place-items-center rounded-lg bg-white p-8 text-center';

export function LeaderboardPage() {
  useDocumentTitle('ACW3 · Leaderboard');
  const [chain, setChain] = useState<(typeof chains)[number]>('BNB Chain');
  const leaderboard = useGetLeaderboardQuery();

  return (
    <div className="min-h-dvh bg-white text-ink">
      <header className="mx-auto flex h-[60px] max-w-[1280px] items-center px-4 sm:px-6 lg:px-8 xl:px-0">
        <Link to="/" className="text-sm font-bold text-brand-dark" aria-label="ACW3 home">
          ACW3
        </Link>
      </header>

      <main className="mx-auto w-full max-w-[1280px] px-4 pb-20 sm:px-6 lg:px-8 xl:px-0">
        <LeaderboardHero />

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
            {/* DummyJSON has no chains, so switching only changes the table caption. */}
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
          <QueryState
            query={leaderboard}
            loadingLabel="Loading leaderboard"
            errorFallback="Could not load the leaderboard."
            className={statusPanel}
            skeleton={<LeaderboardTableSkeleton rows={10} />}
          >
            {(rows) =>
              rows.length ? (
                <LeaderboardTable
                  rows={rows}
                  caption={`Top ${leaderboardSize} creators on ${chain}`}
                />
              ) : (
                <div className={statusPanel}>
                  <p className="text-sm text-muted">No tokens found.</p>
                </div>
              )
            }
          </QueryState>
        </section>
      </main>
    </div>
  );
}
