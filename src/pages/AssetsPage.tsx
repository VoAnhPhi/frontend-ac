import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { getErrorMessage } from '../app/api';
import { AssetList } from '../components/assets/AssetList';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { Loading } from '../components/ui/Loading';
import {
  assetsPerPage,
  useGetAssetsQuery,
  type AssetItem,
  type AssetType,
} from '../features/assets/assetsApi';
import { DeleteTokenDialog } from '../features/assets/DeleteTokenDialog';
import { EditTokenDialog } from '../features/assets/EditTokenDialog';
import { MintDialog } from '../features/assets/MintDialog';

function parsePage(value: string | null) {
  const page = Number.parseInt(value ?? '', 10);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function Pagination({
  label,
  page,
  pageCount,
  total,
  shown,
  onPage,
}: {
  label: string;
  page: number;
  pageCount: number;
  total: number;
  shown: number;
  onPage: (page: number) => void;
}) {
  const first = (page - 1) * assetsPerPage + 1;
  return (
    <nav
      aria-label={label}
      className="mt-2 flex items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm sm:justify-between"
    >
      <p className="hidden text-muted sm:block">
        Showing {first}–{first + shown - 1} of {total}
      </p>
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          Previous
        </Button>
        <span className="min-w-[88px] text-center text-xs sm:text-sm">
          Page {page} of {pageCount}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= pageCount}
          onClick={() => onPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </nav>
  );
}

export function AssetsPage({ type }: { type: AssetType }) {
  const isToken = type === 'token';
  const noun = isToken ? 'tokens' : 'NFTs';
  const [params, setParams] = useSearchParams();
  const page = parsePage(params.get('page'));
  const { data, error, isFetching, refetch } = useGetAssetsQuery({ type, page });
  // RTK Query keeps the last error while it retries, so a retry shows as loading.
  const failed = error && !isFetching;
  const [minting, setMinting] = useState<AssetItem | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<AssetItem | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const pageCount = data ? Math.max(1, Math.ceil(data.total / assetsPerPage)) : 1;

  if (data && !isFetching && page > pageCount) {
    return <Navigate to={pageCount === 1 ? '.' : `?page=${pageCount}`} replace />;
  }

  function goToPage(nextPage: number) {
    setParams(nextPage === 1 ? {} : { page: String(nextPage) });
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="w-full p-3 sm:p-4">
      <p role="status" className="sr-only">
        {announcement}
      </p>
      {failed ? (
        <div className="space-y-4 rounded-lg bg-white p-8 text-center">
          <p role="alert" className="text-sm text-red-600">
            {getErrorMessage(error, `Could not load ${noun}.`)}
          </p>
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : !data ? (
        <div className="grid place-items-center rounded-lg bg-white p-8">
          <Loading label={`Loading ${noun}`} />
        </div>
      ) : (
        <div
          aria-busy={isFetching}
          className={`transition-opacity ${isFetching ? 'opacity-60' : ''}`}
        >
          <AssetList
            type={type}
            items={data.items}
            renderActions={(item) => (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="md:min-w-[90px]"
                  onClick={() => setMinting(item)}
                >
                  Mint
                </Button>
                {isToken && (
                  <>
                    <IconButton
                      icon="edit"
                      label={`Edit ${item.name}`}
                      onClick={() => setEditingId(item.id)}
                    />
                    <IconButton
                      icon="delete"
                      tone="danger"
                      label={`Delete ${item.name}`}
                      onClick={() => setDeleting(item)}
                    />
                  </>
                )}
              </>
            )}
          />
          {data.total > 0 && (
            <Pagination
              label={`${isToken ? 'Token' : 'NFT'} list pages`}
              page={page}
              pageCount={pageCount}
              total={data.total}
              shown={data.items.length}
              onPage={goToPage}
            />
          )}
        </div>
      )}

      {minting && <MintDialog asset={minting} onClose={() => setMinting(null)} />}
      {editingId !== null && (
        <EditTokenDialog
          tokenId={editingId}
          onClose={() => setEditingId(null)}
          onSaved={(name) => {
            setEditingId(null);
            setAnnouncement(`${name} was updated.`);
          }}
        />
      )}
      {deleting && (
        <DeleteTokenDialog
          token={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={() => {
            setDeleting(null);
            setAnnouncement(`${deleting.name} was deleted.`);
          }}
        />
      )}
    </div>
  );
}
