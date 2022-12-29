import { Suspense } from 'solid-js';
import { A, Outlet } from 'solid-start';

export default function Listicles() {
  return (
    <>
      <div class="my-6">
        <A
          href="/"
          class="text-purple-700 hover:text-purple-400 transition-colors mb-4 text-xl block"
        >
          Home-a-roo
        </A>
        <h1 class="font-semibold text-4xl">Listicles</h1>
        <p class="italic">Why do I always say "List-A-cle?"</p>
      </div>
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
}
