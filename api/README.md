# JALS API

---

## Technology stack

- GraphQL:
  - Apollo Server — GraphQL server;
  - `@graphql-tools` — dynamic file loading, schema merging, directives;
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
- `mutations.resolvers.ts` — separated mutation resolvers;
- `resolvers.ts` — object and query resolvers;
- (When needed) `types.ts` — additional TS definitions.

All files in the domain are loaded via the `src/schema.ts` file. This makes extending functionality relatively easy.

Data sources are stored separately due to them being loaded directly to `main.ts` and then attached to context.

### Middleware

Two custom plugins are loaded into the Apollo Server:
- `extensionsPlugin.ts` — appends current session status and requestId to the extensions field;
- `telemetryPlugin.ts` — logs requests with basic metrics (time tracking with dates and `performance`).

### Services

#### Authentication Service

This service handles session and authentication code management. Takes care of authentication header processing, code generation and data retrieval.

#### Mail Service

Transactional emails from templates rendered with React, delivered with Resend.
