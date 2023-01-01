import server$, { eventStream } from 'solid-start/server';
import { Listicle } from '~/data-types';

import { LISTICLE_UPDATED } from './common';
import { CachedEventEmitter } from './emitter';

const eventEmitter = new CachedEventEmitter();

export const handleListicleEvents = server$(async function () {
  return eventStream(server$.request, (send) => {
    const incomingUrl = new URL(server$.request.url);
    const id = incomingUrl.searchParams.get('id');
    // I can't get the cached listener function to work. Maybe the send
    // function is unique for each request. Since each response stream can be
    //canceled based on the incoming request.
    // Maybe we need some sort of client id created.

    // We can see the above also with the `id` parameter. If we change between pages, it stays with whatever the first page was.
    eventEmitter?.addWithKey(
      LISTICLE_UPDATED,
      'listicle',
      (updatedListicle: Listicle) => {
        console.log(`received [${LISTICLE_UPDATED}]`, {
          id,
          updatedListicle,
        });

        if (id === updatedListicle.id) {
          send(LISTICLE_UPDATED, JSON.stringify(updatedListicle));
        }
      }
    );

    console.log('current emitters', eventEmitter.existingListeners);

    return () => {
      console.log(
        'I am not sure this does anything! I wish it did, so I can cancel listeners and stuff!'
      );
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
