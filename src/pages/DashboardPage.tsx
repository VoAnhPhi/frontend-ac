import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';

const actions = [
  {
    to: '/token/create',
    title: 'Create Token',
    text: 'Launch a token without writing code.',
    icon: 'menu-token' as const,
  },
  {
    to: '/token/list',
    title: 'Token List',
    text: 'View and manage your created tokens.',
    icon: 'menu-token' as const,
  },
  {
    to: '/nft/create',
    title: 'Create NFT',
    text: 'Create a new NFT collection.',
    icon: 'menu-nft' as const,
  },
  {
    to: '/nft/list',
    title: 'NFT List',
    text: 'Browse and manage NFT collections.',
    icon: 'menu-nft' as const,
  },
];

export function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="overflow-hidden rounded-2xl bg-white px-5 py-8 sm:px-10 sm:py-12">
        <p className="mb-3 text-sm font-medium text-brand-dark">ACW3 CREATOR</p>
        <h2 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
          Tokens &amp; NFT with Ease
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted sm:text-base">
          Launch tokens, collections and manage your assets through clear guided flows. Choose where
          you want to start.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/token/create"
            className="rounded-full bg-brand px-6 py-3 font-medium text-white hover:bg-brand-dark"
          >
            Create Token
          </Link>
          <Link
            to="/nft/create"
            className="rounded-full border border-brand px-6 py-3 font-medium text-brand hover:bg-[#f5fbfb]"
          >
            Create NFT
          </Link>
        </div>
      </section>
      <section aria-labelledby="quick-actions">
        <h2 id="quick-actions" className="mb-3 text-lg font-bold">
          Quick actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {actions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group flex items-center gap-4 rounded-xl bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              <span className="grid size-11 place-items-center rounded-full bg-[#f5fbfb]">
                <Icon name={action.icon} size={24} />
              </span>
              <span className="min-w-0">
                <strong className="block group-hover:text-brand-dark">{action.title}</strong>
                <span className="mt-1 block text-sm text-muted">{action.text}</span>
              </span>
              <span aria-hidden="true" className="ml-auto text-xl text-muted">
                ›
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
