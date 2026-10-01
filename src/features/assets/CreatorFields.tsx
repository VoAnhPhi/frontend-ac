import { useState } from 'react';
import type { UseFormRegister, UseFormReturn } from 'react-hook-form';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { Textarea } from '../../components/ui/Textarea';

export type CreatorValues = {
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

export const positiveInteger = {
  required: 'This field is required',
  pattern: { value: /^\d+$/, message: 'Enter digits only' },
  validate: (value: string) => Number(value) > 0 || 'Enter a value greater than 0',
};

/** The fields only the token form has, after Name and Symbol. */
export function TokenFields({ form }: { form: UseFormReturn<CreatorValues> }) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;
  const description = watch('description') ?? '';
  return (
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
      <ImageUpload
        id="asset-image"
        label="Image"
        requiredMark
        hint="PNG or JPG, 1000×1000px recommended"
        accept="image/png,image/jpeg"
        error={errors.image?.message}
        {...register('image', {
          required: 'Image is required',
          // `accept` only filters the file picker; any file can still be chosen.
          validate: (files) =>
            ['image/png', 'image/jpeg'].includes(files[0]?.type) || 'Choose a PNG or JPG image',
        })}
      />
      <Textarea
        label="Description"
        requiredMark
        placeholder="Ex: First community token on Zoken..."
        counter={`${description.length}/500`}
        resizable={false}
        className="h-[112px] min-h-[112px] sm:h-[120px] sm:min-h-[120px]"
        maxLength={500}
        error={errors.description?.message}
        {...register('description', {
          required: 'Description is required',
          maxLength: { value: 500, message: 'Maximum 500 characters' },
        })}
      />
    </>
  );
}

export function SocialLinksSection({ register }: { register: UseFormRegister<CreatorValues> }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="mt-6 border-t border-surface pt-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium sm:text-base">Add Social Links &amp; Tags</h3>
          <p className="mt-1 text-xs text-muted">Optional links help people verify your project.</p>
        </div>
        <Switch checked={open} onChange={setOpen} label="Add social links" />
      </div>
      {open && (
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
  );
}
