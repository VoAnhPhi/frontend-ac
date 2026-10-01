import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { startSession } from '../../app/api';
import type { AppDispatch } from '../../app/store';
import { Button } from '../../components/ui/Button';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Input } from '../../components/ui/Input';
import { useLoginMutation, type Credentials } from './authApi';

export function SignInForm({ redirectTo, onSwitch }: { redirectTo: string; onSwitch: () => void }) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [login, { isLoading, error }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Credentials>();

  async function signIn({ username, password }: Credentials) {
    const result = await login({ username: username.trim(), password });
    if (result.error) return;
    dispatch(startSession(result.data));
    navigate(redirectTo, { replace: true });
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
      <ErrorMessage error={error} className="text-center" />
      <Button type="submit" size="lg" loading={isLoading} className="w-full">
        Sign in
      </Button>
      <button type="button" className="mx-auto block text-xs underline" onClick={onSwitch}>
        You don't have an Account?
      </button>
    </form>
  );
}
