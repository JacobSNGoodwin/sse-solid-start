# Todos

- [x] - create a global, or shared, `EventEmitter` on the server
  - This ir probably still needed to listen to events and then send them to client
  - How to we post data to server, and then listen to that in our `eventStream`?
- [x] - create a page `/listicle/{id}` which scopes who receives the message
- [ ] - create an `addBullet`/`addItem` action (server action or function, probably) from this page
  - the action should have access to the room `id`
  - should Emit and event `addItem` with a payload containing the `text` and the room `id`.
- [ ] - connect to an SSE endpoint, passing the room id
  - see [YouTube example](https://www.youtube.com/watch?v=eAwuPvRXNdY), but probably write the server function in another file since it'll be kinda big.
- [x] - create database items: `{ id, text, listicle }`
