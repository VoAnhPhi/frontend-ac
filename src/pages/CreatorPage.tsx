import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';

type FormValues = {
  name: string;
  symbol: string;
  decimals: string;
  supply: string;
  amount: string;
  image: FileList;
  description: string;
  website: string;
  telegram: string;
  discord: string;
  twitter: string;
};

const positiveInteger = {
  required: 'This field is required',
  pattern: { value: /^\d+$/, message: 'Enter digits only' },
  validate: (value: string) => Number(value) > 0 || 'Enter a value greater than 0',
};

export function CreatorPage({ type }: { type: 'token' | 'nft' }) {
  const isToken = type === 'token';
  const [socials, setSocials] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { description: '' } });
  const description = watch('description') ?? '';

  return (
    <div className="mx-auto w-full max-w-[900px] px-3 py-4 sm:px-6 sm:py-10">
      <form
        noValidate
        onSubmit={handleSubmit(() => setSubmitted(true))}
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
            <>
              <Input
                label="Decimals"
                requiredMark
                numeric="integer"
                hint="Most tokens use 6 decimals"
                error={errors.decimals?.message}
                {...register('decimals', {
                  required: 'Decimals are required',
                  pattern: { value: /^\d+$/, message: 'Enter digits only' },
                  validate: (value) => Number(value) <= 18 || 'Maximum 18 decimals',
                })}
              />
              <Input
                label="Supply"
                requiredMark
                numeric="integer"
                hint="Enter the total token supply"
                error={errors.supply?.message}
                {...register('supply', positiveInteger)}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Amount per mint"
                  requiredMark
                  numeric="integer"
                  error={errors.amount?.message}
                  {...register('amount', positiveInteger)}
                />
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <label htmlFor="asset-image" className="text-sm font-medium leading-6">
                  <span aria-hidden="true" className="text-red-500">
                    *{' '}
                  </span>
                  Image
                </label>
                <label className="flex h-[112px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#abe0dd] bg-field p-4 text-center text-xs text-muted transition-colors hover:border-brand-dark hover:bg-brand-soft sm:h-[120px] sm:text-sm">
                  <Icon name="plus" size={22} className="text-brand-dark" />
                  <span className="mt-1 text-ink">Choose an image to upload</span>
                  <span className="text-xs">PNG or JPG, 1000×1000px recommended</span>
                  <input
                    id="asset-image"
                    type="file"
                    accept="image/png,image/jpeg"
                    className="sr-only"
                    aria-required="true"
                    aria-invalid={!!errors.image}
                    aria-describedby={errors.image ? 'asset-image-error' : undefined}
                    {...register('image', { required: 'Image is required' })}
                  />
                </label>
                {errors.image && (
                  <p id="asset-image-error" role="alert" className="text-xs text-red-600">
                    {errors.image.message}
                  </p>
                )}
              </div>
              <Textarea
                label="Description"
                requiredMark
                placeholder="Ex: First community token on Zoken..."
                counter={`${description.length}/500`}
                className="h-[112px] min-h-[112px] resize-none sm:h-[120px] sm:min-h-[120px]"
                maxLength={500}
                error={errors.description?.message}
                {...register('description', {
                  required: 'Description is required',
                  maxLength: { value: 500, message: 'Maximum 500 characters' },
                })}
              />
            </>
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
        {isToken && (
          <section className="mt-6 border-t border-surface pt-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium sm:text-base">Add Social Links &amp; Tags</h3>
                <p className="mt-1 text-xs text-muted">
                  Optional links help people verify your project.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-label="Add social links"
                aria-checked={socials}
                onClick={() => setSocials((value) => !value)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark ${socials ? 'bg-brand-dark' : 'bg-[#d9d9d9]'}`}
              >
                <span
                  className={`absolute top-1 size-5 rounded-full bg-white transition ${socials ? 'left-6' : 'left-1'}`}
                />
              </button>
            </div>
            {socials && (
              <div className="mt-4 grid gap-3">
                <Input label="Website" type="url" placeholder="https://" {...register('website')} />
                <Input
                  label="Telegram"
                  type="url"
                  placeholder="https://t.me/"
                  {...register('telegram')}
                />
                <Input
                  label="Discord"
                  type="url"
                  placeholder="https://discord.gg/"
                  {...register('discord')}
                />
                <Input
                  label="Twitter / X"
                  type="url"
                  placeholder="https://x.com/"
                  {...register('twitter')}
                />
              </div>
            )}
          </section>
        )}
        <Button type="submit" size="lg" className="mt-6 w-full">
          Create
        </Button>
        {submitted && (
          <p role="status" className="mt-3 text-center text-sm text-brand-dark">
            Form is ready. The API connection will be added later.
          </p>
        )}
      </form>
    </div>
  );
}
