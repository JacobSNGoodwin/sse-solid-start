import { For, Suspense } from 'solid-js';
import { Title, useRouteData, A } from 'solid-start';
import { createServerData$ } from 'solid-start/server';

import Loader from '~/components/loader';
import { ListicleInfo } from '~/data-types';

export function routeData() {
  return createServerData$(async () => {
    const response = await fetch('http://localhost:3001/listicles');
    const data = (await response.json()) as ListicleInfo[];

    // console.log('fetched all listicles', data);

    return data;
  });
}

export default function ListiclesList() {
  const listicleData = useRouteData<typeof routeData>();

  return (
    <main>
      <h3 class="font-semibold text-xl text-orange-700 mb-4">
        All the Listicles!
      </h3>

      <Suspense fallback={<Loader />}>
        <Title>Listicles</Title>
        <For each={listicleData() ?? []}>
          {(item) => (
            <li class="list-none">
              <A
                href={`/listicles/${item.id}`}
                class="text-purple-700 hover:text-purple-400 transition-colors"
              >
                {item.title}
              </A>
            </li>
          )}
        </For>
      </Suspense>
    </main>
  );
}
