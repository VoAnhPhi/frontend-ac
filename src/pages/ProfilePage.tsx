import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { Button } from '../components/ui/Button';
import { CopyAddressButton } from '../components/ui/CopyAddressButton';
import { Icon } from '../components/ui/Icon';
import { formatAddress, nfts, tokens, wallet, type AssetItem } from '../features/profile/data';
import { EditProfileDialog } from '../features/profile/EditProfileDialog';

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

function AccountCard({ onEdit }: { onEdit: () => void }) {
  const profile = useSelector((state: RootState) => state.profile);
  return (
    <section
      aria-label="Account"
      className="w-full shrink-0 space-y-3 rounded-lg bg-white p-3 sm:space-y-4 sm:p-4 xl:w-[300px]"
    >
      <div className="flex items-center gap-3">
        <Icon name="avatar" size={40} />
        <div className="min-w-0">
          <p className="font-bold">{profile.name}</p>
          <div className="flex items-center text-xs text-muted sm:text-sm">
            <span className="truncate" title={wallet.address}>
              {formatAddress(wallet.address)}
            </span>
            <CopyAddressButton address={wallet.address} label="wallet" />
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
          <p className="truncate font-medium">
            {item.name}{' '}
            {item.symbol && <span className="ml-1 text-sm text-muted">{item.symbol}</span>}
          </p>
          <div className="flex items-center text-xs">
            <span className="truncate" title={item.address}>
              {formatAddress(item.address)}
            </span>
            <CopyAddressButton address={item.address} label={item.name} />
          </div>
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
              <p className="truncate font-medium">
                {item.name}{' '}
                {item.symbol && <span className="text-sm text-muted">{item.symbol}</span>}
              </p>
              <div className="flex items-center text-xs">
                <span className="truncate" title={item.address}>
                  {formatAddress(item.address)}
                </span>
                <CopyAddressButton address={item.address} label={item.name} />
              </div>
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

export function ProfilePage() {
  const { category } = useParams();
  const isNft = category === 'nfts';
  const [editing, setEditing] = useState(false);
  return (
    <div className="mx-auto flex w-full max-w-[1233px] flex-col items-start gap-3 p-3 sm:gap-4 sm:p-6 xl:flex-row xl:p-4">
      <AccountCard onEdit={() => setEditing(true)} />
      <div className="w-full min-w-0 flex-1 space-y-2">
        <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
          <div className="rounded-lg bg-white px-6 py-4">
            <p className="text-sm text-muted">Total Tokens</p>
            <p className="mt-1 text-xl font-medium sm:text-2xl">{tokens.length}</p>
          </div>
          <div className="rounded-lg bg-white px-6 py-4">
            <p className="text-sm text-muted">Total NFTs</p>
            <p className="mt-1 text-xl font-medium sm:text-2xl">{nfts.length}</p>
          </div>
        </div>
        <AssetCards items={isNft ? nfts : tokens} isNft={isNft} />
        <AssetTable items={isNft ? nfts : tokens} isNft={isNft} />
      </div>
      {editing && <EditProfileDialog onClose={() => setEditing(false)} />}
    </div>
  );
}
