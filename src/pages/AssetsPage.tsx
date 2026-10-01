import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { AssetList, AssetListSkeleton } from '../components/assets/AssetList';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { Pagination } from '../components/ui/Pagination';
import { QueryState } from '../components/ui/QueryState';
import {
  assetsApi,
  assetsPerPage,
  useGetAssetsQuery,
  type AssetItem,
  type AssetType,
} from '../features/assets/assetsApi';
import { DeleteTokenDialog } from '../features/assets/DeleteTokenDialog';
import { EditTokenDialog } from '../features/assets/EditTokenDialog';
import { MintDialog } from '../features/assets/MintDialog';

type DialogKind = 'mint' | 'edit' | 'delete';

function parsePage(value: string | null) {
  const page = Number.parseInt(value ?? '', 10);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function AssetActions({
  asset,
  editable,
  onOpen,
}: {
  asset: AssetItem;
  editable: boolean;
  onOpen: (kind: DialogKind) => void;
}) {
  return (
    <>
      <Button variant="outline" size="sm" className="w-[76px]" onClick={() => onOpen('mint')}>
        Mint
      </Button>
      {editable && (
        <>
          <IconButton icon="edit" label={`Edit ${asset.name}`} onClick={() => onOpen('edit')} />
          <IconButton
            icon="delete"
            tone="danger"
            label={`Delete ${asset.name}`}
            onClick={() => onOpen('delete')}
          />
        </>
      )}
    </>
  );
}

export function AssetsPage({ type }: { type: AssetType }) {
  const isToken = type === 'token';
  const noun = isToken ? 'tokens' : 'NFTs';
  const [params, setParams] = useSearchParams();
  const page = parsePage(params.get('page'));
  const assets = useGetAssetsQuery({ type, page });
  const [dialog, setDialog] = useState<{ kind: DialogKind; asset: AssetItem } | null>(null);
  // Read by screen readers after an edit or delete closes its dialog.
  const [announcement, setAnnouncement] = useState('');
  const pageCount = assets.data ? Math.max(1, Math.ceil(assets.data.total / assetsPerPage)) : 1;
  const prefetchAssets = assetsApi.usePrefetch('getAssets');

  // Loads the pages on either side in the background, so Next and Previous show their rows at
  // once instead of waiting for the server. Pages already in the cache are not fetched again.
  useEffect(() => {
    if (!assets.currentData) return;
    if (page < pageCount) prefetchAssets({ type, page: page + 1 });
    if (page > 1) prefetchAssets({ type, page: page - 1 });
  }, [assets.currentData, page, pageCount, prefetchAssets, type]);

  // A page past the end, such as ?page=99, goes to the last page.
  if (assets.data && !assets.isFetching && page > pageCount) {
    return <Navigate to={pageCount === 1 ? '.' : `?page=${pageCount}`} replace />;
  }

  function goToPage(nextPage: number) {
    setParams(nextPage === 1 ? {} : { page: String(nextPage) });
    window.scrollTo({ top: 0 });
  }

  function closeDialog() {
    setDialog(null);
  }

  function finishDialog(message: string) {
    setDialog(null);
    setAnnouncement(message);
  }

  return (
    <div className="w-full p-3 sm:p-4">
      <p role="status" className="sr-only">
        {announcement}
      </p>
      <QueryState
        query={assets}
        loadingLabel={`Loading ${noun}`}
        errorFallback={`Could not load ${noun}.`}
        skeleton={<AssetListSkeleton type={type} rows={assetsPerPage} />}
      >
        {(data) => (
          <div
            aria-busy={assets.isFetching}
            className={`transition-opacity ${assets.isFetching ? 'opacity-60' : ''}`}
          >
            <AssetList
              type={type}
              items={data.items}
              renderActions={(asset) => (
                <AssetActions
                  asset={asset}
                  editable={isToken}
                  onOpen={(kind) => setDialog({ kind, asset })}
                />
              )}
            />
            {data.total > 0 && (
              <Pagination
                label={`${isToken ? 'Token' : 'NFT'} list pages`}
                page={page}
                pageCount={pageCount}
                pageSize={assetsPerPage}
                total={data.total}
                shown={data.items.length}
                onPage={goToPage}
              />
            )}
          </div>
        )}
      </QueryState>

      {dialog?.kind === 'mint' && <MintDialog asset={dialog.asset} onClose={closeDialog} />}
      {dialog?.kind === 'edit' && (
        <EditTokenDialog
          tokenId={dialog.asset.id}
          onClose={closeDialog}
          onSaved={(name) => finishDialog(`${name} was updated.`)}
        />
      )}
      {dialog?.kind === 'delete' && (
        <DeleteTokenDialog
          token={dialog.asset}
          onClose={closeDialog}
          onDeleted={() => finishDialog(`${dialog.asset.name} was deleted.`)}
        />
      )}
    </div>
  );
}
