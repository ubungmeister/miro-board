'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/app/components/auth/AuthForm';
import { GoogleButton } from '@/app/components/ui/GoogleButton';
import { toast } from 'react-toastify';

export default function SignIn() {
  const router = useRouter();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (!result || result.error) {
        const message = result?.error || 'Login failed';
        setError(message);
        toast.error(message);
      } else {
        router.push('/');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <AuthForm type="signin" onSubmit={handleSubmit} error={error} isLoading={isLoading} />
      <div className="mt-6">
        <div className="relative">
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
          </div>
        </div>
        <div className="mt-6">
          <GoogleButton callbackUrl="/" />
        </div>
      </div>
    </>
  );
}
