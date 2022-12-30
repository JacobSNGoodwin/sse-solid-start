import { createSignal, For, Show, Suspense } from 'solid-js';
import { A, RouteDataArgs, Title, useParams, useRouteData } from 'solid-start';
import { createServerAction$, createServerData$ } from 'solid-start/server';

import Loader from '~/components/loader';
import { Listicle } from '~/data-types';
import { connectToListicileEventSource } from '~/events/client';
import { handleListicleEvents, sendUpdateListicle } from '~/events/server';

// should really refactor this crap
const fetchListicle = async (id: string) => {
  const response = await fetch(
    `http://localhost:3001/listicles/${id}?_embed=entries`
  );
  const data = (await response.json()) as Listicle;

  // console.log(`fetched listicle with id: ${params.id}`, data);

  return data;
};

export function routeData({ params }: RouteDataArgs) {
  // This is double fetching, once server-side, and again client side
  // when `key` is passed a function.
  // see bug: https://github.com/solidjs/solid-start/issues/453
  return createServerData$(fetchListicle, {
    key: params.id,
  });
}

const handleAddItem = async (listicleId: string, text: string) => {
  await fetch(`http://localhost:3001/entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      listicleId,
    }),
  });

  const updatedListicle = await fetchListicle(listicleId);

  sendUpdateListicle(updatedListicle);
};

export default function ListiclePage() {
  const { id } = useParams();
  const initialListicle = useRouteData<typeof routeData>();
  const [newListicle, setNewListicle] = createSignal<Listicle>();
  const latestListicle = () => newListicle() ?? initialListicle.latest;

  // TODO - prevent connection via auth. Perhaps at the page level is
  // sufficient (with server-side row-level security)
  connectToListicileEventSource(handleListicleEvents, id, (updatedListicle) => {
    console.log('received listicle from event source', updatedListicle);
    setNewListicle(updatedListicle);
  });

  // This seems to invalidate and recall routeData() from client.
  // This is great, but I don't know if it updates other clients.
  const [addingItem, addItem] = createServerAction$(
    async ({ id, newItem }: { id: string; newItem: string }) => {
      await handleAddItem(id, newItem);
    }
  );

  const handleKeyUp = (key: string, el: HTMLInputElement) => {
    if (key === 'Enter') {
      addItem({ id, newItem: el.value });
      el.value = '';
    }
  };

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

          <div class="my-8">
            <label for="nextListItem" class="block text-gray font-light">
              New Listicle Item
            </label>
            <input
              id="nextListItem"
              name="nextListItem"
              type="text"
              onKeyUp={(e) => handleKeyUp(e.key, e.currentTarget)}
              class="shadow border-4 border-purple-500 rounded w-96 py-2 px-3 text-gray-700 mt-1 mb-3 focus:outline-none focus:shadow-outline"
            />
            <Show when={addingItem.pending || initialListicle.loading}>
              <div class="my-4 block">
                <Loader />
              </div>
            </Show>
          </div>
        </Suspense>
      </div>
    </>
  );
}
