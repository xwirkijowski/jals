# JALS / Just Another Link Shortener

A simple solution for shortening links built with React and GraphQL with basic safety features.


This is a project I designed and developed as a personal challenge to get some new experience. While I'm not usually working with UIs, I'm really proud of how clean JALS client interface is. JALS server is built using monolithic architecture.

> **See it in action!** Production demo available at [jals.wirkijowski.dev](https://jals.wirkijowski.dev/)!

## 🛠 Features

- Shorten your links
- See the amount of clicks your shortened links generated
- Get details and data about your links by using a `+` modifier at the end of the URL
  - Collected data includes user's platform, if is mobile device and timestamp of click
- Report active links for moderation (WIP)
- Users are redirected the moment a click is registered
- If a link is flagged multiple times, users will be warned about it and will be asked to confirm before proceeding with the redirect

## 🛠 Technologies

- **Client**
  - **React** frontend framework
  - **React Router**
  - **SCSS** CSS preprocessor
  - **CSS Modules**
  - **BEM** naming methodology
  - **GraphQL** (apollo-client)
- **Server**
  - **GraphQL** (apollo-server)
  - **Mongoose** object data modeling
  - **Node**
  - **Dotenv** environment variables loader
  - **Ioredis** redis client
  - **Sentry** monitoring & error tracking
- **Environment**
  - **MongoDB** database
  - **Redis** caching
  - **Nginx** web server & proxy
  
---

You can run JALS locally with full functionality. Just install a MongoDB database and configure the server `.env` accordingly. An example `.env` configuration is available in `.env.example`. You can use a connection string or configure each variable separately for more granular control or special use cases.

> **Heads up!** If your database user uses characters that need to be percent encoded (@, :, /, %), use separate database connection values in `.env` instead of a single connection string variable!

---

## 📋 Future plans

- [ ] Replace ObjectIds with something shorter
- [x] Redis cache implementation
- [x] CORS configuration
- [ ] Containerization
- [ ] Attempt to decompose server into microservices
- [ ] API rate limiter
---

At this moment no license is available.