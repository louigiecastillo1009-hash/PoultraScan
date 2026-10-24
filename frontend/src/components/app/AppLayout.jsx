import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import TopNav from '../TopNav';
import BottomNav from '../BottomNav';
import Footer from '../Footer';

export default function AppLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-ink antialiased">
      <TopNav />
      <div className="md:hidden">
        <BottomNav />
      </div>

      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-[1240px] px-4 pb-10 pt-[calc(env(safe-area-inset-top)+5.5rem)] sm:px-6 md:pb-16 md:pt-28 lg:px-10">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
