import { EventEmitter } from 'events';

// Note - this file is named with .tsx because of some compliation issues that are yet to be resolved: https://github.com/solidjs/solid-start/issues/408

const eventEmitter = new EventEmitter();

export { eventEmitter };
