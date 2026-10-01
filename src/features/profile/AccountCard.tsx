import { useState } from 'react';
import type { QueryResult } from '../../app/api';
import { Button } from '../../components/ui/Button';
import { CopyButton } from '../../components/ui/CopyButton';
import { Icon } from '../../components/ui/Icon';
import { ErrorState } from '../../components/ui/QueryState';
import { Skeleton } from '../../components/ui/Skeleton';
import type { User } from '../auth/authApi';
import { formatAddress, wallet } from './data';
import { EditProfileDialog } from './EditProfileDialog';
import { useProfile } from './profileSlice';

const cardClass =
  'w-full shrink-0 space-y-3 rounded-lg bg-white p-3 sm:space-y-4 sm:p-4 xl:w-[300px]';

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

function AccountCard({ user }: { user: User }) {
  const profile = useProfile(user);
  const [editing, setEditing] = useState(false);
  return (
    <section aria-label="Account" className={cardClass}>
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
            <span className="truncate" title={user.walletAddress}>
              {formatAddress(user.walletAddress)}
            </span>
            <CopyButton value={user.walletAddress} label="Copy wallet address" />
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
      <Button type="button" className="w-full" onClick={() => setEditing(true)}>
        Edit Profile
      </Button>
      {editing && (
        <EditProfileDialog userId={user.id} profile={profile} onClose={() => setEditing(false)} />
      )}
    </section>
  );
}

/**
 * The account card's loading placeholder. Each bar sits in the same text element as the real
 * content, so the card keeps its real height and nothing below it moves when the user arrives.
 */
function AccountCardSkeleton() {
  return (
    <section aria-label="Account" className={cardClass}>
      <p role="status" className="sr-only">
        Loading profile
      </p>
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="min-w-0">
          <p className="font-bold">
            <Skeleton inline className="h-4 w-28 rounded" />
          </p>
          <div className="flex items-center text-xs sm:text-sm">
            <Skeleton inline className="h-3 w-32 rounded" />
            {/* The copy button's space. */}
            <span className="size-7" />
          </div>
        </div>
      </div>
      {['Balance', 'Biography'].map((section) => (
        <div key={section}>
          <h2 className="text-base font-medium sm:text-lg">
            <Skeleton inline className="h-4 w-20 rounded" />
          </h2>
          <p className="mt-1 text-sm">
            <Skeleton inline className="h-3.5 w-16 rounded" />
          </p>
        </div>
      ))}
      <div>
        <h2 className="text-base font-medium sm:text-lg">
          <Skeleton inline className="h-4 w-24 rounded" />
        </h2>
        <div className="mt-2 flex items-center gap-3">
          {[0, 1, 2].map((icon) => (
            <Skeleton key={icon} className="size-[18px] rounded" />
          ))}
        </div>
      </div>
      <Skeleton className="h-9 w-full rounded-full" />
    </section>
  );
}

/** The account card, or its loading or error state while the user is not available. */
export function AccountSection({ me }: { me: QueryResult<User> }) {
  if (me.data) return <AccountCard user={me.data} />;
  if (!me.isError) return <AccountCardSkeleton />;
  return (
    <section aria-label="Account" className={`${cardClass} grid place-items-center`}>
      <ErrorState
        className="space-y-3 py-6 text-center"
        error={me.error}
        fallback="Could not load your profile."
        onRetry={() => me.refetch()}
      />
    </section>
  );
}
