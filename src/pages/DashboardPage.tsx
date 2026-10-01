import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { appHome, redirectTarget } from '../app/routes';
import { Dialog } from '../components/ui/Dialog';
import { RegisterForm } from '../features/auth/RegisterForm';
import { SignInForm } from '../features/auth/SignInForm';
import { selectIsAuthenticated } from '../features/auth/authSlice';

type AuthMode = 'register' | 'signin';

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
