import { EventEmitter } from 'events';

// Note - this file is named with .tsx because of some compliation issues that are yet to be resolved: https://github.com/solidjs/solid-start/issues/408

type ListenerFunc = (...args: any[]) => void;

// This Allows only a single listener for each event type.
// Didn't really want to extend EventEmitter, though maybe
// that's a better idea... hmmm...
class CachedEventEmitter {
  ee: EventEmitter;
  existingListeners: Map<string, ListenerFunc>;
  constructor() {
    this.ee = new EventEmitter();
    this.existingListeners = new Map();
  }

  // Overrides the super.on method so we can only have one
  // listener function befre combo of "eventName:listerKey".
  // It can be difficult to handle closures and know which function
  // for which we want to add and remove listeners. For this reason
  // we add a key
  addWithKey(eventName: string, listenerKey: string, listener: ListenerFunc) {
    const mapKey = `${eventName}:${listenerKey}`;
    if (!this.existingListeners.has(mapKey)) {
      this.ee.on(eventName, listener);
      this.existingListeners.set(mapKey, listener);
    }
    return this;
  }

  removeWithKey(
    eventName: string,
    listenerKey: string,
    listener: ListenerFunc
  ) {
    const mapKey = `${eventName}:${listenerKey}`;
    if (this.existingListeners.has(mapKey)) {
      this.ee.off(eventName, listener);
      this.existingListeners.delete(mapKey);
    }
    return this;
  }

  eventListeners(eventName: string) {
    return this.ee.listeners(eventName);
  }

  emit(eventName: string, data: any) {
    this.ee.emit(eventName, data);
  }
}

export { CachedEventEmitter };
