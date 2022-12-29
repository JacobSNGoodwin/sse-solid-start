# Todos

- [x] - create a global, or shared, `EventEmitter` on the server
  - Is this needed given solid-start's exported `eventStream`?
- [ ] - create a page `/room/{id}` which scopes who receives the message
- [ ] - create an `addBullet`/`addItem` action (server action, probably) from this page
  - the action should have access to the room `id`
  - should Emit and event `addItem` with a payload containing the `text` and the room `id`.
- [ ] - connect to an SSE endpoint, passing the room id
  - see [YouTube example](https://www.youtube.com/watch?v=eAwuPvRXNdY), but probably write the server function in another file since it'll be kinda big. 
  - Will solid-js `eventStream` work for us? Can we use the request object to check authorization? Or maybe just loading the page is sufficient for the authorization.
  - [ ] - create database items: `{ id, text, room }`
