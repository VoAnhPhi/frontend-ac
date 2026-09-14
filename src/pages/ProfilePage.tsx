import { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { nfts, tokens, type AssetItem } from '../features/profile/data';
import { EditProfileDialog } from '../features/profile/EditProfileDialog';

const walletAddress = '0x4aq...gfr6j5lda';

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
      className="w-full shrink-0 space-y-4 rounded-lg bg-white p-4 lg:w-[300px]"
    >
      <div className="flex items-center gap-3">
        <Icon name="avatar" size={40} />
        <div className="min-w-0">
          <p className="font-bold">{profile.name}</p>
          <p className="truncate text-sm text-muted">{walletAddress}</p>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-medium">Balance</h2>
        <p className="mt-1 text-sm text-muted">200 ZKN</p>
      </div>
      <div>
        <h2 className="text-lg font-medium">Biography</h2>
        <p className="mt-1 text-sm text-muted">{profile.biography || 'None'}</p>
      </div>
      <div>
        <h2 className="text-lg font-medium">Social Links</h2>
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
  const [copied, setCopied] = useState(false);
  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(item.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }
  return (
    <div
      role="row"
      className={`grid min-w-[640px] items-center gap-4 border-b border-surface px-4 py-3 last:border-0 ${isNft ? 'grid-cols-[minmax(220px,1fr)_120px_120px]' : 'grid-cols-[minmax(220px,1fr)_90px_120px_120px]'}`}
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
          <div className="flex items-center gap-1 text-xs">
            <span className="truncate">{item.address}</span>
            <button
              type="button"
              onClick={copyAddress}
              aria-label={`Copy address for ${item.name}`}
              title={copied ? 'Copied' : 'Copy address'}
              className="rounded p-1 hover:bg-surface focus-visible:outline-2 focus-visible:outline-brand"
            >
              <Icon name="copy" size={16} />
            </button>
            {copied && (
              <span role="status" className="text-brand-dark">
                Copied
              </span>
            )}
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
  return (
    <div
      className="overflow-x-auto rounded-lg bg-white"
      role="table"
      aria-label={isNft ? 'NFTs' : 'Tokens'}
    >
      <div
        role="row"
        className={`grid min-w-[640px] items-center gap-4 border-b border-surface px-4 py-4 text-sm text-muted ${isNft ? 'grid-cols-[minmax(220px,1fr)_120px_120px]' : 'grid-cols-[minmax(220px,1fr)_90px_120px_120px]'}`}
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
          Total of Supply
        </span>
      </div>
      {items.map((item) => (
        <AssetRow key={item.id} item={item} isNft={isNft} />
      ))}
    </div>
  );
}

export function ProfilePage() {
  const { category } = useParams();
  const isNft = category === 'nfts';
  const [editing, setEditing] = useState(false);
  return (
    <div className="mx-auto flex max-w-[1233px] flex-col items-start gap-4 p-4 lg:flex-row lg:p-4">
      <AccountCard onEdit={() => setEditing(true)} />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-white px-6 py-4">
            <p className="text-sm text-muted">Total Tokens</p>
            <p className="mt-1 text-2xl font-medium">0</p>
          </div>
          <div className="rounded-lg bg-white px-6 py-4">
            <p className="text-sm text-muted">Total NFTs</p>
            <p className="mt-1 text-2xl font-medium">0</p>
          </div>
        </div>
        {isNft && (
          <nav aria-label="Profile assets" className="flex gap-2 rounded-t-lg bg-white px-4 pt-4">
            <NavLink
              to="/profile/tokens"
              className="rounded-lg px-4 py-1 text-muted hover:bg-[#f5fbfb]"
            >
              Tokens
            </NavLink>
            <NavLink to="/profile/nfts" className="rounded-lg bg-[#f5fbfb] px-4 py-1 font-medium">
              NFTs
            </NavLink>
          </nav>
        )}
        <AssetTable items={isNft ? nfts : tokens} isNft={isNft} />
      </div>
      {editing && <EditProfileDialog onClose={() => setEditing(false)} />}
    </div>
  );
}
