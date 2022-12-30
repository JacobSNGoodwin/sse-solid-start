import { List } from 'postcss/lib/list';
import { createSignal, For, Suspense } from 'solid-js';
import { A, RouteDataArgs, Title, useRouteData } from 'solid-start';
import server$, { createServerData$ } from 'solid-start/server';

import Loader from '~/components/loader';
import { Listicle } from '~/data-types';
import { handleListicleEvents, connectToListicileEventSource } from '~/events';

export function routeData({ params }: RouteDataArgs) {
  // This is double fetching, once server-side, and again client side
  // when `key` is passed a function.
  // see bug: https://github.com/solidjs/solid-start/issues/453
  return createServerData$(
    async (id) => {
      const response = await fetch(
        `http://localhost:3001/listicles/${id}?_embed=entries`
      );
      const data = (await response.json()) as Listicle;

      // console.log(`fetched listicle with id: ${params.id}`, data);

      return data;
    },
    {
      key: params.id,
    }
  );
}

export default function Listicle() {
  const initialListicle = useRouteData<typeof routeData>();
  const [newListicle, setNewListicle] = createSignal<Listicle>();
  const latestListicle = () => newListicle() ?? initialListicle.latest;

  // const serverFn = server$(async (id: string) => {
  //   console.log('the server request', server$.request);
  //   console.log('the listicle id: ', id);
  // });

  // serverFn(initialListicle()?.id ?? 'placeholder_id');

  // connectToListicileEventSource(
  //   handleListicleEvents(this.request, initialListicle()?.id ?? '').url,
  //   (updatedListicle: Listicle) => setNewListicle(updatedListicle)
  // );

  return (
    <>
      <div class="block my-4">
        <div class="block my-8">
          <A
            href="/listicles"
            class="py-2 px-4 bg-purple-600 text-white rounded-md disabled:bg-gray-400"
          >
            Back to all Listicles
          </A>
        </div>

        <Suspense fallback={<Loader />}>
          <Title>{latestListicle()?.title}</Title>
          <h3 class="text-2xl text-orange-700 my-4">
            {latestListicle()?.title}
          </h3>
          <For each={latestListicle()?.entries ?? []}>
            {(item) => <p class="font-bold">{item.text}</p>}
          </For>
        </Suspense>
      </div>
    </>
  );
}
