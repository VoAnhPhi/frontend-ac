import { skipToken } from '@reduxjs/toolkit/query/react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getErrorMessage } from '../app/api';
import type { RootState } from '../app/store';
import { AssetSubtitle } from '../components/assets/AssetList';
import { Button } from '../components/ui/Button';
import { CopyAddressButton } from '../components/ui/CopyAddressButton';
import { Icon } from '../components/ui/Icon';
import { Loading } from '../components/ui/Loading';
import type { AssetItem, AssetType } from '../features/assets/assetsApi';
import { useGetHoldingsQuery } from '../features/assets/holdingsApi';
import { useGetMeQuery, type User } from '../features/auth/authApi';
import { formatAddress, wallet } from '../features/profile/data';
import { EditProfileDialog } from '../features/profile/EditProfileDialog';
import { defaultProfile, type Profile } from '../features/profile/profileSlice';

function SocialIcon({
  name,
  href,
  label,
}: {
  name: 'twitter' | 'github' | 'telegram';
  href: string;
  label: string;
}) {
  const content = <Icon name={name} size={18} />;
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="rounded focus-visible:outline-2 focus-visible:outline-brand"
    >
      {content}
    </a>
  ) : (
    <span title={`${label} not set`} className="opacity-60">
      {content}
    </span>
  );
}

const accountCardClass =
  'w-full shrink-0 space-y-3 rounded-lg bg-white p-3 sm:space-y-4 sm:p-4 xl:w-[300px]';

function AccountCard({
  user,
  profile,
  onEdit,
}: {
  user: User;
  profile: Profile;
  onEdit: () => void;
}) {
  const address = user.walletAddress ?? wallet.address;
  return (
    <section aria-label="Account" className={accountCardClass}>
      <div className="flex items-center gap-3">
        {user.image ? (
          <img src={user.image} alt="" className="size-10 shrink-0 rounded-full bg-field" />
        ) : (
          <Icon name="avatar" size={40} />
        )}
        <div className="min-w-0">
          <p className="truncate font-bold" title={profile.name}>
            {profile.name}
          </p>
          <div className="flex items-center text-xs text-muted sm:text-sm">
            <span className="truncate" title={address}>
              {formatAddress(address)}
            </span>
            <CopyAddressButton address={address} label="wallet" />
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-base font-medium sm:text-lg">Balance</h2>
        <p className="mt-1 text-sm text-muted">
          {wallet.balance} {wallet.symbol}
        </p>
      </div>
      <div>
        <h2 className="text-base font-medium sm:text-lg">Biography</h2>
        <p className="mt-1 text-sm text-muted">{profile.biography || 'None'}</p>
      </div>
      <div>
        <h2 className="text-base font-medium sm:text-lg">Social Links</h2>
        <div className="mt-2 flex items-center gap-3">
          <SocialIcon name="twitter" href={profile.twitter} label="Twitter / X" />
          <SocialIcon name="github" href={profile.github} label="GitHub" />
          <SocialIcon name="telegram" href={profile.telegram} label="Telegram" />
        </div>
      </div>
      <Button type="button" className="w-full" onClick={onEdit}>
        Edit Profile
      </Button>
    </section>
  );
}

function AssetRow({ item, isNft }: { item: AssetItem; isNft: boolean }) {
  return (
    <div
      role="row"
      className={`grid items-center gap-4 border-b border-surface px-4 py-3 last:border-0 ${isNft ? 'grid-cols-[minmax(220px,1fr)_120px_120px]' : 'grid-cols-[minmax(220px,1fr)_90px_120px_120px]'}`}
    >
      <div role="cell" className="flex min-w-0 items-center gap-4">
        <img
          src={item.image}
          width={44}
          height={44}
          alt=""
          className="size-11 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="truncate font-medium" title={item.name}>
            {item.name}
          </p>
          <AssetSubtitle item={item} />
        </div>
      </div>
      {!isNft && (
        <div role="cell" className="text-center font-medium">
          {item.balance}
        </div>
      )}
      <div role="cell" className="text-center font-medium">
        {item.supplyPercent}%
      </div>
      <div role="cell" className="text-right font-medium">
        {item.totalSupply}
      </div>
    </div>
  );
}

function AssetTable({ items, isNft }: { items: AssetItem[]; isNft: boolean }) {
  if (!items.length) {
    return (
      <div className="hidden rounded-lg bg-white p-8 text-center text-sm text-muted md:block">
        No assets found.
      </div>
    );
  }
  return (
    <div
      className="hidden overflow-hidden rounded-lg bg-white md:block"
      role="table"
      aria-label={isNft ? 'NFTs' : 'Tokens'}
    >
      <div
        role="row"
        className={`grid items-center gap-4 border-b border-surface px-4 py-4 text-sm text-muted ${isNft ? 'grid-cols-[minmax(220px,1fr)_120px_120px]' : 'grid-cols-[minmax(220px,1fr)_90px_120px_120px]'}`}
      >
        <span role="columnheader" className="text-ink">
          {isNft ? 'NFT' : 'Token'}
        </span>
        {!isNft && (
          <span role="columnheader" className="text-center">
            Balance
          </span>
        )}
        <span role="columnheader" className="text-center">
          % of Supply
        </span>
        <span role="columnheader" className="text-right">
          Total Supply
        </span>
      </div>
      {items.map((item) => (
        <AssetRow key={item.id} item={item} isNft={isNft} />
      ))}
    </div>
  );
}

function AssetCards({ items, isNft }: { items: AssetItem[]; isNft: boolean }) {
  if (!items.length) {
    return (
      <div className="rounded-lg bg-white p-8 text-center text-sm text-muted md:hidden">
        No assets found.
      </div>
    );
  }
  return (
    <div className="space-y-3 md:hidden">
      {items.map((item) => (
        <article key={item.id} className="rounded-lg bg-white p-4">
          <div className="flex items-center gap-3">
            <img src={item.image} alt="" className="size-11 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="truncate font-medium" title={item.name}>
                {item.name}
              </p>
              <AssetSubtitle item={item} />
            </div>
          </div>
          <dl
            className={`mt-4 grid gap-2 text-center text-sm ${isNft ? 'grid-cols-2' : 'grid-cols-3'}`}
          >
            {!isNft && (
              <div>
                <dt className="text-xs text-muted">Balance</dt>
                <dd className="mt-1 font-medium">{item.balance}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-muted">% of Supply</dt>
              <dd className="mt-1 font-medium">{item.supplyPercent}%</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Total Supply</dt>
              <dd className="mt-1 font-medium">{item.totalSupply}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}

function HoldingCount({
  label,
  value,
  failed,
}: {
  label: string;
  value?: number;
  failed: boolean;
}) {
  return (
    <div className="rounded-lg bg-white px-6 py-4">
      <p className="text-sm text-muted">{label}</p>
      {value === undefined && !failed ? (
        <p className="mt-1 flex h-7 items-center sm:h-8">
          <span className="h-5 w-10 animate-pulse rounded bg-field" />
          <span className="sr-only">Loading</span>
        </p>
      ) : (
        <p className="mt-1 text-xl font-medium sm:text-2xl">{value ?? '-'}</p>
      )}
    </div>
  );
}

export function ProfilePage() {
  const { category } = useParams();
  const isNft = category === 'nfts';
  const [editing, setEditing] = useState(false);
  const { data: user, error, isFetching, refetch } = useGetMeQuery();
  const holdings = useGetHoldingsQuery(user?.id ?? skipToken);
  const savedProfile = useSelector((state: RootState) =>
    user ? state.profile[user.id] : undefined,
  );
  const profile = user && (savedProfile ?? defaultProfile(user));
  // RTK Query keeps the last error while it retries, so a retry shows as loading.
  const userFailed = error && !isFetching;
  const holdingsFailed = holdings.error && !holdings.isFetching;
  // Holdings wait for the user, so a failed user request is also why they are missing.
  const holdingsError = holdingsFailed ? holdings.error : userFailed ? error : undefined;
  const holdingsOf = (type: AssetType) => holdings.data?.filter((item) => item.type === type);
  const items = holdingsOf(isNft ? 'nft' : 'token');
  return (
    <div className="mx-auto flex w-full max-w-[1233px] flex-col items-start gap-3 p-3 sm:gap-4 sm:p-6 xl:flex-row xl:p-4">
      {user && profile ? (
        <AccountCard user={user} profile={profile} onEdit={() => setEditing(true)} />
      ) : (
        <section aria-label="Account" className={`${accountCardClass} grid place-items-center`}>
          {userFailed ? (
            <div className="space-y-3 py-6 text-center">
              <p role="alert" className="text-sm text-red-600">
                {getErrorMessage(error, 'Could not load your profile.')}
              </p>
              <Button type="button" variant="secondary" size="sm" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          ) : (
            <div className="py-10">
              <Loading label="Loading profile" />
            </div>
          )}
        </section>
      )}
      <div className="w-full min-w-0 flex-1 space-y-2">
        <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
          <HoldingCount
            label="Total Tokens"
            value={holdingsOf('token')?.length}
            failed={!!holdingsError}
          />
          <HoldingCount
            label="Total NFTs"
            value={holdingsOf('nft')?.length}
            failed={!!holdingsError}
          />
        </div>
        {holdingsError ? (
          <div className="space-y-3 rounded-lg bg-white p-8 text-center">
            <p role="alert" className="text-sm text-red-600">
              {getErrorMessage(holdingsError, 'Could not load your assets.')}
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => (holdingsFailed ? holdings.refetch() : refetch())}
            >
              Try again
            </Button>
          </div>
        ) : items ? (
          <>
            <AssetCards items={items} isNft={isNft} />
            <AssetTable items={items} isNft={isNft} />
          </>
        ) : (
          <div className="grid place-items-center rounded-lg bg-white p-8">
            <Loading label="Loading assets" />
          </div>
        )}
      </div>
      {editing && user && profile && (
        <EditProfileDialog userId={user.id} profile={profile} onClose={() => setEditing(false)} />
      )}
    </div>
  );
}
