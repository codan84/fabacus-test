To run:
```
npm install
npm start:docker
```

Docs endpoint: localhost:3000/api-docs

Notes:
- Normally I'd use TypeScript and fp-ts for error handling (like using fp-ts/Either), see some comments in the code
- I didn't bother about auth
- Some error handling might be missing, I did some basic checks and used AJV for input validation
- Normally I'd generate TS model based on JSON schemas (I prefer schema-first approach)
- I had to use `edge` version of `redis/redis-stack` to take advantage of TTL setting on hash keys (added in Redis 7.4.0), took me some time to realise it is not available on `latest`
- I only have basic knowledge of Redis, so forgive me if the approach I chose is naive and there are much better ones. If so - I'd love to hear about better approach in any kind of feedback, thanks x
