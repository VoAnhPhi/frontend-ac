import { getErrorMessage } from '../../app/api';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { useDeleteAssetMutation, type AssetItem } from './assetsApi';

export function DeleteTokenDialog({
  token,
  onClose,
  onDeleted,
}: {
  token: AssetItem;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [deleteAsset, { isLoading, error }] = useDeleteAssetMutation();

  async function confirm() {
    try {
      await deleteAsset(token).unwrap();
      onDeleted();
    } catch {
      /* The error is rendered from the mutation state. */
    }
  }

  return (
    <Dialog title="Delete Token" onClose={onClose}>
      <p className="text-center text-sm leading-6">
        Delete <span className="font-bold break-words">{token.name}</span> from your token list?
      </p>
      {error && (
        <p role="alert" className="mt-3 text-center text-sm text-red-600">
          {getErrorMessage(error)}
        </p>
      )}
      <div className="mt-6 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant="danger" loading={isLoading} onClick={confirm}>
          Delete
        </Button>
      </div>
    </Dialog>
  );
}
