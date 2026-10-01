import { useParams } from 'react-router-dom';
import { QueryState } from '../components/ui/QueryState';
import type { AssetType } from '../features/assets/assetsApi';
import { useUserHoldings } from '../features/assets/holdingsApi';
import { useGetMeQuery } from '../features/auth/authApi';
import { AccountSection } from '../features/profile/AccountCard';
import {
  HoldingCount,
  HoldingsList,
  HoldingsSkeleton,
  ProfileTabs,
} from '../features/profile/Holdings';

export function ProfilePage() {
  const { category } = useParams();
  const type: AssetType = category === 'nfts' ? 'nft' : 'token';
  const me = useGetMeQuery();
  const holdings = useUserHoldings(me);
  const countOf = (kind: AssetType) => holdings.data?.filter((item) => item.type === kind).length;

  return (
    <div className="mx-auto flex w-full max-w-[1233px] flex-col items-start gap-3 p-3 sm:gap-4 sm:p-6 xl:flex-row xl:p-4">
      <AccountSection me={me} />
      <div className="w-full min-w-0 flex-1 space-y-2">
        <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
          <HoldingCount label="Total Tokens" value={countOf('token')} failed={holdings.isError} />
          <HoldingCount label="Total NFTs" value={countOf('nft')} failed={holdings.isError} />
        </div>
        <section aria-label="Assets" className="rounded-lg bg-white p-4">
          <ProfileTabs />
          <QueryState
            query={holdings}
            loadingLabel="Loading assets"
            errorFallback="Could not load your assets."
            className="grid place-items-center px-4 py-8 text-center"
            skeleton={<HoldingsSkeleton type={type} rows={4} />}
          >
            {(items) => (
              <HoldingsList type={type} items={items.filter((item) => item.type === type)} />
            )}
          </QueryState>
        </section>
      </div>
    </div>
  );
}
