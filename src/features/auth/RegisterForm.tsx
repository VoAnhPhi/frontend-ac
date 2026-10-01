import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui/Button';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Input } from '../../components/ui/Input';
import { useRegisterMutation, type Registration } from './authApi';

type RegisterValues = Registration & { confirmPassword: string };

export function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [registerUser, { isLoading, error, data: created }] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterValues>();

  function submit({ username, walletAddress, password }: RegisterValues) {
    // The result, success or error, is rendered from the mutation state.
    return registerUser({
      username: username.trim(),
      walletAddress: walletAddress.trim(),
      password,
    });
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
      <ErrorMessage error={error} className="text-center" />
      <Button type="submit" size="lg" loading={isLoading} className="w-full">
        Register
      </Button>
      <button type="button" className="mx-auto block text-xs underline" onClick={onSwitch}>
        You already have an Account?
      </button>
    </form>
  );
}
