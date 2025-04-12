'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Google from '/public/images/google-icon.svg';

interface GoogleButtonProps {
  callbackUrl?: string;
}

export const GoogleButton = ({ callbackUrl = '/' }: GoogleButtonProps) => {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl });
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4] transition-colors"
    >
      <Image src={Google} alt="Google Icon" width={20} height={20} />
      <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
    </button>
  );
};
