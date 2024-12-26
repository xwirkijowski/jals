# JALS API

---

## Technology stack

- GraphQL:
  - Apollo Server — GraphQL server;
  - `@graphql-tools` — dynamic file loading, schema merging;
  - `@graphql-scalars` — scalars resolvers and validation;
- Databases:
  - MongoDB, `mongoose` driver — link, click and user data;
  - Redis, `redis-om` interface — sessions and authentication codes;
- Utility:
  - Eudoros — logging;
  - Luxon — date comparisons and conversions to object;
  - `ulid` — Identifier generation (`requestId`, `sessionId`, `authCodeId`);
  - Resend — Authentication emails;

## Components

### Domain modules

Logic and components follow the domain-driven design (DDD) approach.

There are 4 domains:
- Click
- Link
- User
- Session

Each domain contains:
- `typeDefs.graphql` — the GraphQL type definitions;
- `mutations.graphql` — GraphQL mutations, and related payload type definitions and inputs;
- `mutations.resolvers.js` — separated mutation resolvers;
- `resolvers.js` — object and query resolvers.

All files in the domain are loaded via the `src/schema.js` file. This makes extending functionality relatively easy.

Data sources are stored separately due to them being loaded directly to `main.js` and then attached to context.

### Middleware

Two custom plugins are loaded into the Apollo Server:
- `extensionsPlugin.js` — appends current session status and requestId to the extensions field;
- telemetryPlugin.js — logs requests with basic metrics (time tracking with dates and `performance`)/

### Authentication Service

This service handles session and authentication code management. 