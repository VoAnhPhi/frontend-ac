import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
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
    const result = await deleteAsset(token);
    if (!result.error) onDeleted();
  }

  return (
    <Dialog title="Delete Token" onClose={onClose}>
      <p className="text-center text-sm leading-6">
        Delete <span className="font-bold break-words">{token.name}</span> from your token list?
      </p>
      <ErrorMessage error={error} className="mt-3 text-center" />
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
