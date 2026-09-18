import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';

type AuthMode = 'register' | 'signin';
export function DashboardPage() {
  const navigate = useNavigate();
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

  function enterApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate('/token/create');
  }

  return (
    <div className="flex h-full min-h-[calc(100dvh-104px)] flex-col bg-white px-3 py-3 sm:min-h-[calc(100dvh-112px)] sm:px-6 sm:py-6">
      <section className="relative flex min-h-[420px] flex-1 items-center justify-center overflow-hidden rounded-lg bg-[#89d9e4] bg-[url('/figma/connect-landscape-v2.png')] bg-cover bg-center px-3 text-center sm:min-h-[520px] sm:px-4">
        <div className="relative z-10 max-w-[620px]">
          <h2 className="text-2xl font-medium leading-tight sm:text-4xl">
            Tokens &amp; NFT with Ease
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-sm leading-6 sm:mt-5 sm:text-lg">
            Launch tokens, liquidity, airdrops, and much more.
            <br />
            Effortlessly and without coding.
          </p>
          <button
            type="button"
            onClick={() => openDialog('register')}
            className="mt-6 rounded-full bg-white px-7 py-2.5 text-sm font-medium text-brand-dark shadow-sm hover:bg-field focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark sm:mt-7 sm:px-8 sm:py-3"
          >
            Connect Your Wallet
          </button>
        </div>
      </section>

      {dialogOpen && (
        <Dialog title={mode === 'register' ? 'Register' : 'Sign in'} onClose={closeDialog}>
          <form noValidate className="space-y-4" onSubmit={enterApplication}>
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
