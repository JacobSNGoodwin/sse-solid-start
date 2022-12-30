import EventEmitter from 'events';
import { isServer } from 'solid-js/web';

// Note - this file is named with .tsx because of some compliation issues that are yet to be resolved: https://github.com/solidjs/solid-start/issues/408

// In case we have an issue spinning up lots of these
// This follows a similar pattern to how you can set
// up events in remix: https://remix.run/docs/en/v1/tutorials/jokes#set-up-prisma

// let eventEmitter: EventEmitter | undefined;

// declare global {
//   var __eventEmitter: EventEmitter | undefined;
// }

// // TODO - there has to be a better way to keep
// // this from running in the browser. Hmm...
// // The issue is the handleListicleEvents
// if (isServer) {
//   if (process.env.NODE_ENV === 'production') {
//     eventEmitter = new EventEmitter();
//   } else {
//     if (!global.__eventEmitter) {
//       global.__eventEmitter = new EventEmitter();
//     }
//     eventEmitter = global.__eventEmitter;
//   }
// } else {
//   eventEmitter = undefined;
// }

const eventEmitter = isServer ? new EventEmitter() : undefined;

export default eventEmitter;
