import { createEffect, onCleanup } from 'solid-js';
import { ListicleMessageHandler, LISTICLE_UPDATED } from './common';

// Note - this file is named with .tsx because of some compliation issues that are yet to be resolved: https://github.com/solidjs/solid-start/issues/408

// See https://github.com/solidjs/solid-start/blob/main/examples/with-websocket/src/routes/sse.tsx
const connectToListicileEventSource = (
  { url }: { url: string }, //better typing?
  listicleId: string,
  onMessage: ListicleMessageHandler
): void => {
  createEffect(() => {
    // currently I can't find a way to pass the $server function reference
    // while also passing in the id. This is a workaround I don't like much.
    const eventSourceUrl = `${url}?id=${listicleId}`;
    const eventSource = new EventSource(eventSourceUrl, {
      withCredentials: true,
    });

    console.log('EventSource created', eventSource);

    eventSource.addEventListener(
      LISTICLE_UPDATED,
      (updatedListicle: MessageEvent) => {
        onMessage(JSON.parse(updatedListicle.data));
      }
    );

    onCleanup(() => eventSource.close());
  });
};

export { connectToListicileEventSource };
