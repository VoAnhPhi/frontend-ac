import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';

type FormValues = {
  name: string;
  symbol: string;
  decimals: string;
  supply: string;
  amount: string;
  description: string;
  website: string;
  telegram: string;
  discord: string;
  twitter: string;
};

export function CreatorPage({ type }: { type: 'token' | 'nft' }) {
  const isToken = type === 'token';
  const [socials, setSocials] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [description, setDescription] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  return (
    <div className="mx-auto w-full max-w-[900px] px-4 py-8 sm:px-6 sm:py-10">
      <form
        onSubmit={handleSubmit(() => setSubmitted(true))}
        className="rounded-lg bg-white p-4 sm:p-6 lg:p-10"
      >
        <header className="mb-8 text-center">
          <h2 className="text-2xl font-bold">
            {isToken ? 'Token Creator' : 'Create NFT Collection'}
          </h2>
          {isToken && (
            <p className="mt-2 text-sm text-muted">
              Easily Create your own Token in just 7+1 steps without Coding.
            </p>
          )}
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Name"
            requiredMark
            hint="Max 32 characters in your name"
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
            hint="Max 8 characters in your symbol"
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
                label="Decimal"
                requiredMark
                type="number"
                hint="Most token use 6 decimals"
                {...register('decimals', { required: true })}
              />
              <Input
                label="Supply"
                requiredMark
                type="number"
                hint="Most token use 10B"
                {...register('supply', { required: true })}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Amount per mint"
                  requiredMark
                  type="number"
                  {...register('amount', { required: true })}
                />
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-sm font-medium leading-6">
                  <span aria-hidden="true" className="text-red-500">
                    *{' '}
                  </span>
                  Image
                </span>
                <label className="flex h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#abe0dd] bg-[#f5fbfb] p-4 text-center text-sm text-muted transition-colors hover:border-brand hover:bg-[#eefafa]">
                  <span className="text-2xl text-brand">＋</span>
                  <span className="mt-1 text-ink">Drag and drop here to upload</span>
                  <span className="text-xs">.png, .jpg, 1000×1000px</span>
                  <input type="file" accept="image/png,image/jpeg" className="sr-only" required />
                </label>
              </div>
              <Textarea
                label="Description"
                requiredMark
                placeholder="Ex: First community token on Zoken..."
                counter={`${description.length}/500`}
                className="h-[120px] min-h-[120px] resize-none"
                maxLength={500}
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </>
          ) : (
            <div className="sm:col-span-2">
              <Input
                label="Total Supply"
                requiredMark
                type="number"
                hint="Most token use 10B"
                {...register('supply', { required: true })}
              />
            </div>
          )}
        </div>
        {isToken && (
          <section className="mt-6 border-t border-surface pt-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-medium">Add Social Links &amp; Tags</h3>
                <p className="mt-1 text-xs text-muted">Max 32 characters in your name</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={socials}
                onClick={() => setSocials((value) => !value)}
                className={`relative h-7 w-12 rounded-full transition ${socials ? 'bg-brand' : 'bg-[#d9d9d9]'}`}
              >
                <span
                  className={`absolute top-1 size-5 rounded-full bg-white transition ${socials ? 'left-6' : 'left-1'}`}
                />
              </button>
            </div>
            {socials && (
              <div className="mt-4 grid gap-3">
                <Input label="Website" placeholder="https://" {...register('website')} />
                <Input label="Telegram" placeholder="https://t.me/" {...register('telegram')} />
                <Input label="Discord" placeholder="https://discord.gg/" {...register('discord')} />
                <Input label="Twitter" placeholder="https://x.com/" {...register('twitter')} />
              </div>
            )}
          </section>
        )}
        <Button type="submit" size="lg" className="mt-6 w-full">
          Create
        </Button>
        {submitted && (
          <p role="status" className="mt-3 text-center text-sm text-brand-dark">
            Form is ready. API connection will be added later.
          </p>
        )}
      </form>
    </div>
  );
}
