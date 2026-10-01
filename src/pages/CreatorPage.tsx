import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Input } from '../components/ui/Input';
import { useAddAssetMutation, type AssetType } from '../features/assets/assetsApi';
import {
  positiveInteger,
  SocialLinksSection,
  TokenFields,
  type CreatorValues,
} from '../features/assets/CreatorFields';

export function CreatorPage({ type }: { type: AssetType }) {
  const isToken = type === 'token';
  const navigate = useNavigate();
  const [addAsset, { isLoading, error }] = useAddAssetMutation();
  const form = useForm<CreatorValues>({ defaultValues: { description: '' } });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  async function submit(values: CreatorValues) {
    // A DummyJSON product has no field for symbol, decimals, amount per mint, image, or links.
    const file = values.image?.[0];
    const image = file && URL.createObjectURL(file);
    const result = await addAsset({
      type,
      fields: {
        name: values.name.trim(),
        supply: Number(values.supply),
        description: values.description.trim(),
      },
      image,
    });
    if (!result.error) navigate(`/${type}/list`);
    // On success the new asset keeps showing the image, so only a failed create releases it.
    else if (image) URL.revokeObjectURL(image);
  }

  return (
    <div className="mx-auto w-full max-w-[900px] px-3 py-4 sm:px-6 sm:py-10">
      <form
        noValidate
        onSubmit={handleSubmit(submit)}
        className="rounded-lg bg-white p-3 sm:p-6 lg:p-10"
      >
        <header className="mb-5 text-center sm:mb-8">
          <h2 className="text-lg font-bold sm:text-2xl">
            {isToken ? 'Token Creator' : 'Create NFT Collection'}
          </h2>
          {isToken && (
            <p className="mt-1 text-[11px] text-muted sm:mt-2 sm:text-sm">
              Create your own token in eight simple steps—no coding required.
            </p>
          )}
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Name"
            requiredMark
            hint="Maximum 32 characters"
            placeholder="Ex: Zoken"
            error={errors.name?.message}
            {...register('name', {
              required: 'Name is required',
              maxLength: { value: 32, message: 'Maximum 32 characters' },
            })}
          />
          <Input
            label="Symbol"
            requiredMark
            hint="Maximum 8 characters"
            placeholder="Ex: ZKN"
            error={errors.symbol?.message}
            {...register('symbol', {
              required: 'Symbol is required',
              maxLength: { value: 8, message: 'Maximum 8 characters' },
            })}
          />
          {isToken ? (
            <TokenFields form={form} />
          ) : (
            <div className="sm:col-span-2">
              <Input
                label="Total Supply"
                requiredMark
                numeric="integer"
                hint="Enter the collection supply"
                error={errors.supply?.message}
                {...register('supply', positiveInteger)}
              />
            </div>
          )}
        </div>
        {isToken && <SocialLinksSection register={register} />}
        <Button type="submit" size="lg" loading={isLoading} className="mt-6 w-full">
          Create
        </Button>
        <ErrorMessage error={error} className="mt-3 text-center" />
      </form>
    </div>
  );
}
