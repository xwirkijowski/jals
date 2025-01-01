# JALS Client

This is the second project I built using React, and the first this complex. Naturally it's not really that complex, but It was quite a ride to get it to where it is now. 

---

## What users can do with it?

- Shorten their links
- See the amount of clicks their shortened links generated
- Get details and data about their link by using a `+` modifier at the end of the URL
- Report active links for moderation (WIP)
- If a link is flagged multiple times, users will be warned about it and will be asked to confirm before proceeding with the redirect

### Currently collected click data
 
- Platform
- If device is a mobile device
- Time of click

## Under the hood:

- Bootstrapped using **create-react-app**
- **CSS Modules** styling with **SCSS** using **BEM** methodology
- API link using **apollo-client** (**GraphQL**)
- Routing and navigation with **React Router**