'use client';

import { usePathname } from 'next/navigation';

export function AdScripts() {
  const pathname = usePathname();

  // Do not show or load ad scripts on login / sign-in pages
  if (pathname && (pathname.startsWith('/login') || pathname.startsWith('/signin') || pathname.startsWith('/register'))) {
    return null;
  }

  return (
    <>
      <script src="https://5gvci.com/act/files/tag.min.js?z=11485082" data-cfasync="false" async></script>
      <script src="https://quge5.com/88/tag.min.js" data-zone="266219" async data-cfasync="false"></script>
    </>
  );
}
