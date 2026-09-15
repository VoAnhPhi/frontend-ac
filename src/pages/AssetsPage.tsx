import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { nfts, tokens } from '../features/profile/data';

export function AssetsPage({ type }: { type: 'token' | 'nft' }) {
  const isToken = type === 'token';
  const items = isToken ? tokens : nfts;
  return (
    <div className="mx-auto w-full max-w-[1200px] p-4 sm:p-6 lg:p-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">{isToken ? 'List Tokens' : 'NFT Collections'}</h2>
          <p className="mt-1 text-sm text-muted">Assets created by your connected wallet</p>
        </div>
        <Link
          to={isToken ? '/token/create' : '/nft/create'}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark"
        >
          {isToken ? 'Create Token' : 'Create NFT'}
        </Link>
      </div>
      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl bg-white p-4">
            <div className="flex items-center gap-3">
              <img src={item.image} alt="" className="size-11 rounded-full object-cover" />
              <div>
                <h3 className="font-medium">
                  {item.name}{' '}
                  {item.symbol && <span className="text-sm text-muted">{item.symbol}</span>}
                </h3>
                <p className="text-xs text-muted">{item.address}</p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <dt className="text-xs text-muted">Balance</dt>
                <dd className="mt-1 font-medium">{item.balance ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Supply</dt>
                <dd className="mt-1 font-medium">{item.supplyPercent}%</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Total</dt>
                <dd className="mt-1 font-medium">{item.totalSupply}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <div className="hidden overflow-hidden rounded-xl bg-white md:block">
        <div className="grid grid-cols-[minmax(260px,1fr)_120px_120px_140px] border-b border-surface px-5 py-4 text-sm text-muted">
          <span>{isToken ? 'Token' : 'NFT'}</span>
          <span className="text-center">Balance</span>
          <span className="text-center">% of Supply</span>
          <span className="text-right">Total Supply</span>
        </div>
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[minmax(260px,1fr)_120px_120px_140px] items-center border-b border-surface px-5 py-3 last:border-0"
          >
            <div className="flex items-center gap-3">
              <img src={item.image} alt="" className="size-11 rounded-full object-cover" />
              <div>
                <p className="font-medium">
                  {item.name}{' '}
                  {item.symbol && <span className="text-sm text-muted">{item.symbol}</span>}
                </p>
                <p className="flex items-center gap-1 text-xs">
                  {item.address}
                  <Icon name="copy" />
                </p>
              </div>
            </div>
            <span className="text-center">{item.balance ?? '—'}</span>
            <span className="text-center">{item.supplyPercent}%</span>
            <span className="text-right">{item.totalSupply}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
