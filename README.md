# EasyForm
We build a simple yet powerful form creator and manager that can serve as a solid and secure foundation for building WMS, CRM, HR, or other software applications.

## 💻 Setup
First, you need to activate a database. This project uses PostgreSQL, which can be easily set up and activated using the provided docker compose file. 
```bash
docker compose up -d
```

Afterwards create a .env file and add following:
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/smart_form?schema=public"
```

Then, perform the migration to initialise the database.
```bash
npx prisma migrate dev --name Initial
```

Lastly, install the packages and run the application.
```bash
pnpm install
pnpm run dev
```

### Authentication:
To enable authentication, you'll need to add a few additional variables to your `.env` file. <b style="color: #66B2FF">It’s important to note that setting up authentication is crucial for the application to function properly!</b>
```bash
AUTH_GOOGLE_ID=your_google_id
AUTH_GOOGLE_SECRET=your_google_secret
AUTH_SECRET=your_auth_secret
AUTH_TRUST_HOST=True
```

To obtain the Google Client ID and Secret, navigate to the **Google Cloud Console**. From there, go to **APIs & Services** → **Credentials** → **Create Credentials**. Be sure to add `http://localhost:3000/api/auth/callback/google` as the redirect URI. On the same page, you’ll find the generated **Client ID** and **Client Secret**. Currently, only Google authentication is supported, but this can be easily extended by modifying the files: `src/auth.ts` and `src/register/page.tsx`. You'll also need to create an authentication secret for encrypting the JWT token. This can be done by running the following command:
```bash
openssl rand -hex 32
```
Lastly, if you're deploying the application behind a reverse proxy, ensure that `AUTH_TRUST_HOST` is set to `true` in your environment variables.

## 🔥 How to extend response types?
- First, add the new response type in the FormResponseType enum (location: `./prisma/schema.prisma`) and make sure the perform a migration to update the database.
- Then, go to `./src/components/formEditor`.
- There you have to update the protocol.ts file first.
- Next, go to the directory named formResponses.
- Afterwards, update the config and response render files.
- Finally, you have to create a new directory and use the new response type as name. That directory should contain at least config.tsx and response.tsx.

If you'd like to make your new response types open-source (which we strongly encourage), please ensure they align closely with the platform's existing styling for consistency.

## 💡 Rational behind our tech stack
We chose **Next.js** as our framework for its hybrid capabilities, allowing us to efficiently manage both client-side and server-side rendering. For authentication, we integrated **Auth.js** due to its strong compatibility with Next.js. For client state management we use **Zustand** because of its simplicity and minimal setup compared to Redux. For server state management, we rely on **TanStack**, which optimizes API handling with its smart caching and synchronization strategies. Our codebase is written in **TypeScript** to leverage type safety and improve code reliability. For styling, we use **Tailwind** to keep styles closely tied to the components they apply to, which enhances maintainability.