'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { AuthModal } from '@/components/auth/AuthModal';

export default function LoginPage() {
  const router = useRouter();
  const { currentUser } = useAppStore();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (currentUser.email) {
      router.replace('/type');
    }
  }, [currentUser.email, router]);

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Login Required</h1>
          <p className="mt-3 text-sm text-zinc-400">
            You need to sign in or create an account before you can start typing and earn Karma Coins.
          </p>
        </div>

        <AuthModal
          isOpen={isOpen && !currentUser.email}
          onClose={() => {
            setIsOpen(false);
            router.replace('/');
          }}
          initialMode="login"
        />
      </div>
    </div>
  );
}
