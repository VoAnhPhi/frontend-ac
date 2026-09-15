import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';

type AuthMode = 'register' | 'signin';

export function DashboardPage() {
  const [params, setParams] = useSearchParams();
  const initialMode = params.get('dialog') === 'signin' ? 'signin' : 'register';
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const dialogOpen = params.has('dialog');

  function openDialog(nextMode: AuthMode) {
    setMode(nextMode);
    setParams({ dialog: nextMode });
  }

  function closeDialog() {
    setParams({});
  }

  return (
    <div className="flex h-full min-h-[calc(100dvh-112px)] flex-col bg-white px-4 py-5 sm:px-6 sm:py-6">
      <section className="relative flex min-h-[520px] flex-1 items-center justify-center overflow-hidden rounded-lg bg-[#89d9e4] bg-[url('/figma/connect-landscape-v2.png')] bg-cover bg-center px-4 text-center">
        <div className="relative z-10 max-w-[620px]">
          <h2 className="text-3xl font-medium leading-tight sm:text-4xl">
            Tokens &amp; NFT with Ease
          </h2>
          <p className="mx-auto mt-5 max-w-[560px] text-base leading-6 sm:text-lg">
            Launch Token, Liquidity, Airdrops and much more.
            <br />
            Effortless and without coding.
          </p>
          <button
            type="button"
            onClick={() => openDialog('register')}
            className="mt-7 rounded-full bg-white px-8 py-3 text-sm font-medium text-brand-dark shadow-sm hover:bg-[#f5fbfb]"
          >
            Connect Your Wallet
          </button>
        </div>
      </section>

      {dialogOpen && (
        <Dialog title={mode === 'register' ? 'Register' : 'Sign in'} onClose={closeDialog}>
          <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
            <Input label="Wallet Address" placeholder="0x..." autoFocus />
            <Input label="Password" type="password" placeholder="••••••••••" />
            {mode === 'register' && (
              <Input label="Confirm Password" type="password" placeholder="••••••••••" />
            )}
            <Button type="submit" size="lg" className="w-full">
              {mode === 'register' ? 'Register' : 'Sign in'}
            </Button>
            <button
              type="button"
              className="mx-auto block text-xs underline"
              onClick={() => openDialog(mode === 'register' ? 'signin' : 'register')}
            >
              {mode === 'register' ? 'You already have an Account?' : "You don't have an Account?"}
            </button>
          </form>
        </Dialog>
      )}
    </div>
  );
}
