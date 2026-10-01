import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getErrorMessage, startSession } from '../app/api';
import { appHome } from '../app/routes';
import type { AppDispatch } from '../app/store';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import {
  useLoginMutation,
  useRegisterMutation,
  type Credentials,
  type Registration,
} from '../features/auth/authApi';
import { selectIsAuthenticated } from '../features/auth/authSlice';

type AuthMode = 'register' | 'signin';

function redirectTarget(state: unknown) {
  if (
    typeof state === 'object' &&
    state !== null &&
    'from' in state &&
    typeof state.from === 'string' &&
    state.from.startsWith('/')
  )
    return state.from;
  return appHome;
}

function SignInForm({ redirectTo, onSwitch }: { redirectTo: string; onSwitch: () => void }) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [login, { isLoading, error }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Credentials>();

  async function signIn({ username, password }: Credentials) {
    try {
      const tokens = await login({ username: username.trim(), password }).unwrap();
      dispatch(startSession(tokens));
      navigate(redirectTo, { replace: true });
    } catch {
      /* The error is rendered from the mutation state. */
    }
  }

  return (
    <form noValidate className="space-y-4" onSubmit={handleSubmit(signIn)}>
      <Input
        label="Username"
        placeholder="emilys"
        autoComplete="username"
        autoFocus
        error={errors.username?.message}
        {...register('username', {
          validate: (value) => value.trim().length > 0 || 'Username is required',
        })}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••••"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password', { required: 'Password is required' })}
      />
      {error && (
        <p role="alert" className="text-center text-sm text-red-600">
          {getErrorMessage(error)}
        </p>
      )}
      <Button type="submit" size="lg" loading={isLoading} className="w-full">
        Sign in
      </Button>
      <button type="button" className="mx-auto block text-xs underline" onClick={onSwitch}>
        You don't have an Account?
      </button>
    </form>
  );
}

type RegisterValues = Registration & { confirmPassword: string };

function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [registerUser, { isLoading, error, data: created }] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterValues>();

  async function submit({ username, walletAddress, password }: RegisterValues) {
    try {
      await registerUser({
        username: username.trim(),
        walletAddress: walletAddress.trim(),
        password,
      }).unwrap();
    } catch {
      /* The error is rendered from the mutation state. */
    }
  }

  if (created) {
    return (
      <div className="space-y-5 text-center">
        <p role="status" className="text-sm leading-6">
          Account <span className="font-bold break-words">{created.username}</span> was created.
          DummyJSON does not store new accounts, so sign in with an existing DummyJSON user.
        </p>
        <Button type="button" size="lg" autoFocus className="w-full" onClick={onSwitch}>
          Go to Sign in
        </Button>
      </div>
    );
  }

  return (
    <form noValidate className="space-y-4" onSubmit={handleSubmit(submit)}>
      <Input
        label="Username"
        placeholder="Choose a username"
        autoComplete="username"
        autoFocus
        error={errors.username?.message}
        {...register('username', {
          validate: (value) => value.trim().length > 0 || 'Username is required',
        })}
      />
      <Input
        label="Wallet Address"
        placeholder="0x..."
        autoComplete="off"
        spellCheck={false}
        error={errors.walletAddress?.message}
        {...register('walletAddress', {
          required: 'Wallet address is required',
          pattern: {
            value: /^\s*0x[0-9a-fA-F]{40}\s*$/,
            message: 'Enter 0x followed by 40 hexadecimal characters',
          },
        })}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••••"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password', {
          required: 'Password is required',
          minLength: { value: 8, message: 'Use at least 8 characters' },
        })}
      />
      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••••••"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', {
          required: 'Confirm your password',
          validate: (value) => value === getValues('password') || 'Passwords do not match',
        })}
      />
      {error && (
        <p role="alert" className="text-center text-sm text-red-600">
          {getErrorMessage(error)}
        </p>
      )}
      <Button type="submit" size="lg" loading={isLoading} className="w-full">
        Register
      </Button>
      <button type="button" className="mx-auto block text-xs underline" onClick={onSwitch}>
        You already have an Account?
      </button>
    </form>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [params, setParams] = useSearchParams();
  const mode: AuthMode = params.get('dialog') === 'register' ? 'register' : 'signin';
  const dialogOpen = params.has('dialog');

  function openDialog(nextMode: AuthMode) {
    // Keep the page the guard sent the user from while they switch between the two forms.
    setParams({ dialog: nextMode }, { state: location.state });
  }

  function closeDialog() {
    setParams({});
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
            onClick={() => (isAuthenticated ? navigate(appHome) : openDialog('signin'))}
            className="mt-6 rounded-full bg-white px-7 py-2.5 text-sm font-medium text-brand-dark shadow-sm hover:bg-field focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark sm:mt-7 sm:px-8 sm:py-3"
          >
            Connect Your Wallet
          </button>
        </div>
      </section>

      {dialogOpen && (
        <Dialog title={mode === 'register' ? 'Register' : 'Sign in'} onClose={closeDialog}>
          {mode === 'register' ? (
            <RegisterForm onSwitch={() => openDialog('signin')} />
          ) : (
            <SignInForm
              redirectTo={redirectTarget(location.state)}
              onSwitch={() => openDialog('register')}
            />
          )}
        </Dialog>
      )}
    </div>
  );
}
