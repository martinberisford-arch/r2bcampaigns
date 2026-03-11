import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { signIn } from '../../features/auth/api';
import { signInSchema, type SignInInput } from '../../lib/validation/schemas';

export function SignInPage() {
  const form = useForm<SignInInput>({ resolver: zodResolver(signInSchema), defaultValues: { email: '', password: '' } });
  const mutation = useMutation({ mutationFn: ({ email, password }: SignInInput) => signIn(email, password) });

  return (
    <main className="auth-wrap">
      <form className="auth-card" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
        <h1>Roots2Branches Project Hub</h1>
        <p className="meta">Sign in to continue.</p>
        <label>Email<input type="email" {...form.register('email')} /></label>
        <label>Password<input type="password" {...form.register('password')} /></label>
        <button className="btn btn-primary" disabled={mutation.isPending}>{mutation.isPending ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </main>
  );
}
