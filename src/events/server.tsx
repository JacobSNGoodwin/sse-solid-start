import server$, { eventStream } from 'solid-start/server';
import { Listicle } from '~/data-types';

import { LISTICLE_UPDATED } from './common';
import eventEmitter from './emitter';

export const handleListicleEvents = server$(async function () {
  return eventStream(server$.request, (send) => {
    const incomingUrl = new URL(server$.request.url);
    const id = incomingUrl.searchParams.get('id');

    eventEmitter?.on(LISTICLE_UPDATED, (updatedListicle: Listicle) => {
      console.log(`received [${LISTICLE_UPDATED}]`, updatedListicle);
      if (id === updatedListicle.id) {
        console.log(`Sending [${LISTICLE_UPDATED}]`, updatedListicle);
        send(LISTICLE_UPDATED, JSON.stringify(updatedListicle));
      }
    });

    console.log(
      `current listener count for [${LISTICLE_UPDATED}]: ${eventEmitter?.listenerCount(
        LISTICLE_UPDATED
      )}`
    );
    // setTimeout(() => {
    //   if (id === '1') {
    //     send(
    //       LISTICLE_UPDATED,
    //       JSON.stringify({
    //         id: '1',
    //         title: 'Top Oaxaca Moles',
    //         entries: [
    //           { id: '1', text: "Mama's Moles 1" },
    //           { id: '2', text: "Mama's Moles 2" },
    //           { id: '3', text: "Mama's Moles 3" },
    //         ],
    //       })
    //     );
    //   }
    // }, 5000);

    return () => {
      console.log('closed event stream for listicle id: ', id);
    };
  });
});

// Make sure this only rides on server as browser client does not have
// EventEmitter
export const sendUpdateListicle = (listicile: Listicle) => {
  eventEmitter?.emit(LISTICLE_UPDATED, listicile);
};
