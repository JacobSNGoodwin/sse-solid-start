import { For, Suspense } from 'solid-js';
import { A, RouteDataArgs, Title, useRouteData } from 'solid-start';
import { createServerData$ } from 'solid-start/server';

import Loader from '~/components/loader';
import { Listicle } from '~/data-types';

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    async (key) => {
      const response = await fetch(
        `http://localhost:3001/listicles/${key}?_embed=entries`
      );
      const data = (await response.json()) as Listicle;

      // console.log(`fetched listicle with id: ${params.id}`, data);

      return data;
    },
    {
      key: () => params.id,
    }
  );
}

export default function List() {
  const initialListicle = useRouteData<typeof routeData>();
  // const [newListicle, setNewListicle] = createSignal<Listicle>();

  // const latestListicle = () => newListicle() ?? initialListicle();

  return (
    <>
      <A
        href="/listicles"
        class="py-2 px-4 bg-purple-600 text-white rounded-md disabled:bg-gray-400"
      >
        Back to all Listicles
      </A>

      <div class="block my-4">
        <Suspense fallback={<Loader />}>
          <Title>{initialListicle()?.title}</Title>
          <h3 class="text-2xl text-orange-700 my-4">
            {initialListicle()?.title}
          </h3>
          <For each={initialListicle()?.entries ?? []}>
            {(item) => <p class="font-bold">{item.text}</p>}
          </For>
        </Suspense>
      </div>
    </>
  );
}
