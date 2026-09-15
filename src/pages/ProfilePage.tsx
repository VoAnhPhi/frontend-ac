import { NavLink, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { nfts, tokens } from '../features/profile/data';

export function ProfilePage() {
  const { category } = useParams();
  const profile = useSelector((state: RootState) => state.profile);
  const assets = category === 'nfts' ? nfts : tokens;
  return (
    <div className="mx-auto max-w-[1201px] p-4">
      <div className="rounded-lg bg-white p-6">
        <h2 className="text-xl font-semibold">{profile.name}</h2>
        <p className="text-muted">0x4aq...gfr6j5lda</p>
      </div>
      <nav aria-label="Profile assets" className="mt-4 flex gap-2">
        <NavLink to="/profile/tokens" className="rounded-lg bg-white px-4 py-2">
          Tokens
        </NavLink>
        <NavLink to="/profile/nfts" className="rounded-lg bg-white px-4 py-2">
          NFTs
        </NavLink>
      </nav>
      <p className="mt-4 text-sm text-muted">
        {assets.length} {category === 'nfts' ? 'NFTs' : 'Tokens'}
      </p>
    </div>
  );
}
