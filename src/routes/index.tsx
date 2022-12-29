import { A, Title } from 'solid-start';

export default function Home() {
  return (
    <main>
      <Title>SSR World</Title>

      <div class="my-6">
        <h1 class="font-semibold text-4xl">Hello, SSR World!</h1>
        <p class="italic">A site with a little of everything!</p>
      </div>
      <A
        href="listicles"
        class="text-purple-700 hover:text-purple-400 transition-colors"
      >
        Go to Listicles
      </A>
    </main>
  );
}
