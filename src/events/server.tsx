import server$, { eventStream } from 'solid-start/server';
import { Listicle } from '~/data-types';
import { LISTICLE_UPDATED } from './common';
import { eventEmitter } from './emitter';

// TODO
// Update this to SSEEventEmitter whose emit method will actually
// process the sending of the SSE event.
// However it will need methods to track current requests and "senders".

export const handleListicleEvents = server$(async function () {
  const incomingUrl = new URL(server$.request.url);
  const id = incomingUrl.searchParams.get('id');

  return eventStream(server$.request, (send) => {
    // We need a send function specific to each request, which
    // is why we add the lister to this SSEEmitter.
    eventEmitter?.on(LISTICLE_UPDATED, (updatedListicle) => {
      console.log(`received [${LISTICLE_UPDATED}]`, {
        id,
        updatedListicle,
      });

      if (id === updatedListicle.id) {
        send(LISTICLE_UPDATED, JSON.stringify(updatedListicle));
      }
    });

    return () => {
      console.log('Cleanup after EventSource request closed');
    };
  });
});

// Make sure this only runs on server as browser client does not have
// EventEmitter.
// Seems like even though this is only used inside of a `createServerAction$`
// that the code is still imported on the client. That's probably a compiler
// issue that needs to be resolved.
export const sendUpdateListicle = server$(async (listicile: Listicle) => {
  console.log(`emitting [${LISTICLE_UPDATED}]`, listicile);
  eventEmitter?.emit(LISTICLE_UPDATED, listicile);
});
