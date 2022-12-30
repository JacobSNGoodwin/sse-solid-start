import EventEmitter from 'events';
import { onCleanup } from 'solid-js';
import server$, { eventStream } from 'solid-start/server';

import { Listicle } from './data-types';

// I case we have an issue spinning up lots of these
// This follows a similar pattern to how you can set
// up events in remix: https://remix.run/docs/en/v1/tutorials/jokes#set-up-prisma

// let eventEmitter: EventEmitter;

// declare global {
//   var __eventEmitter: EventEmitter | undefined;
// }

// if (process.env.NODE_ENV === 'production') {
//   eventEmitter = new EventEmitter();
// } else {
//   if (!global.__eventEmitter) {
//     global.__eventEmitter = new EventEmitter();
//   }
//   eventEmitter = global.__eventEmitter;
// }

const LISTICLE_UPDATED = 'listicle_updated';

const eventEmitter = new EventEmitter();

const handleListicleEvents = server$(async function (
  request: Request,
  listicleId: string
) {
  return eventStream(request, (send) => {
    // TODO - come up with distinct names for event emitter event
    // and Server-sent event to client in `send`.
    // eventEmitter.on(LISTICLE_UPDATED, (updatedListicle: Listicle) => {
    //   if (listicleId === updatedListicle.id) {
    //     send(LISTICLE_UPDATED, updatedListicle);
    //   }
    // });

    // TODO - restore event emitter above. This is a temp check to set state
    setTimeout(() => {
      send(LISTICLE_UPDATED, {
        id: '1',
        title: 'Top Oaxaca Moles',
        entries: [
          { id: '1', text: "Mama's Moles 1" },
          { id: '2', text: "Mama's Moles 2" },
          { id: '3', text: "Mama's Moles 3" },
        ],
      });
    }, 5000);

    return () => {
      console.log('closed event stream for listicle id', listicleId);
    };
  });
});

const updateListicle = (id: string, listicile: Listicle) => {
  eventEmitter.emit(LISTICLE_UPDATED, listicile);
};

type MessageHandler = (event: MessageEvent) => void;

const connectToListicileEventSource = (
  serverFunctionUrl: string,
  onMessage: MessageHandler
): void => {
  const eventSource = new EventSource(serverFunctionUrl);

  eventSource.addEventListener(LISTICLE_UPDATED, (updatedListicle) => {
    onMessage(updatedListicle);
  });

  onCleanup(() => eventSource.close());
};

export { handleListicleEvents, updateListicle, connectToListicileEventSource };
