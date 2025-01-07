# JALSv2 Client

## Summary

### Functionality

### Implemented Features
#### Dynamic routes (Next.js/App router)
Retrieving link identifiers and redirecting to inspection page on `/[linkId]/+`.

#### Route interception (Next.js/App)
Leveraged for implementing authentication modals and other contextual modals (e.g. link flagging `/inspect/[linkId]/flag`).

#### Server Components (Next.js, React)
Separation of sensitive information, business logic and interactivity layer.

####  Server actions (Next.js) + `useFormState` (React) 
Implemented on all forms that result in mutations. Occasionally leveraging built-in `.bind()` method for additional data.

#### `useContext` (React)
Link context implementation on `/inspect` route;

## Walkthrough

### Authentication Flow

