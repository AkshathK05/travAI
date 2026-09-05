# travAI Engineering & Architectural Rules

All developers and AI assistants working on **travAI** must strictly adhere to the following rules.

---

## 1. Secret & Key Isolation (Zero API Key Leakage)
- **Client-Side Gemini API Key:** The Gemini API key must **never** be hardcoded or baked into the bundle. It is managed strictly under the **BYOK (Bring Your Own Key)** architecture:
  - Stored in the browser's `localStorage` under `'travai_gemini_api_key'`.
  - Fallback loaded via `import.meta.env.VITE_GEMINI_API_KEY` only if configured by the user.
  - Queries are sent directly from the client's browser to Google's Gemini API endpoints.
- **Firebase Web Keys:** Firebase client variables (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, etc.) are public identifiers used by the Firebase JS SDK and may be safely defined in client environment variables.
- **Server-Side Secrets:** Any server-only credentials (`GEOAPIFY_API_KEY`, `RAPIDAPI_KEY`, `PINECONE_API_KEY`, LiteAPI keys, etc.) must live exclusively in `.env.local` or host environment variables (e.g. Vercel dashboard). They must **never** be injected with `VITE_` client prefixes or accessed in client-side code.
- **No Secrets in Repo:** Never commit `.env.local` or paste bearer tokens into Git commits, PRs, comments, or documentation files.
- **No Leaking to Browser:** Serverless endpoints must return only scrubbed, normalized travel payloads—never raw API response bodies containing proprietary vendor headers or keys.

---

## 2. Active File Scope
- **Active Code Tree:** Only create or edit files in:
  - `vite-project/src/` (Frontend React components, services, and types)
  - `vite-project/api/` (Vercel Serverless functions)
  - `vite-project/server/` (Server services and knowledge seeding utilities)
  - Root markdown files (`rules.md`, `context.md`, `DEMO_TRACK_GUIDE.md`, `README.md`)
- **Legacy Files:** `vite-project/src/App.jsx` and `vite-project/src/main.jsx` are deprecated relics from the initial Vite template. Do **NOT** modify or import them. The live application entry points are `vite-project/index.html` -> `vite-project/src/main.tsx` -> `vite-project/src/App.tsx`.

---

## 3. Strict Serverless ESM Imports
- When authoring TypeScript files in `vite-project/api/` or `vite-project/server/`, any relative import of another local TypeScript module must include the **`.js` extension suffix**:
  ```typescript
  // CORRECT
  import { searchPlaces } from '../../server/services/placesService.js';
  import { searchFlights } from '../../server/services/flightsService.js';

  // INCORRECT (breaks in Vercel serverless Node ESM runtime)
  import { searchPlaces } from '../../server/services/placesService';
  ```

---

## 4. Non-Blocking Fetch Pattern (Zero-Downtime Resilience)
- All context retrieval calls (Pinecone RAG, Geoapify Places v2 / OpenStreetMap Overpass, Flight Search, Hotel Recommendations) must execute concurrently using `Promise.allSettled()`.
- **Silent Failover:** Every retrieval function must catch all network errors, timeouts, or rate-limit HTTP codes (`429`, `500`, `504`) and fail gracefully by returning empty arrays or empty strings:
  ```typescript
  try {
    const res = await fetch('/api/...');
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn('Grounding fetch failed gracefully:', err);
    return [];
  }
  ```
- **Gemini Stream Continuity:** External API delays or failures must **never** block or terminate the user's core Gemini text stream.

---

## 5. No Chain-of-Thought (CoT) / Thinking Leakage
- Modern Gemini models (such as `gemini-2.5-flash` or `gemini-2.0-flash`) produce internal thought chunks.
- When streaming tokens through `streamGeminiQuery()`, always filter candidate content parts where `(part as any).thought === true`.
- Never display model reasoning, drafts, or self-evaluations to the user.

---

## 6. Neo-Brutalist UI Standard
- Maintain strict design system fidelity across all components:
  - **Canvas:** `#F4F4F0`
  - **Cards & Surfaces:** `#FFFFFF` with `border-[2.5px] border-black` or `border-[3px] border-black`
  - **Shadows:** Hard offset drop-shadows with **zero blur**:
    - Cards: `shadow-[3.5px_3.5px_0px_#000000]` or `shadow-[4px_4px_0px_#000000]`
    - Buttons & Badges: `shadow-[2px_2px_0px_#000000]`
    - **Never** use blurry Tailwind drop shadows (`shadow-md`, `shadow-lg`, etc.).
  - **Tactile Feedback:** Buttons and interactive pills must depress on active click:
    `active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000000]`.
  - **Accents:** Neon Yellow (`#FFE600`), Cyan (`#00F0FF`), Mint (`#00E599`), Pink (`#FF5376`).
  - **Typography:** `font-heading font-black uppercase` for titles/badges (Space Grotesk), `font-bold` for body text (Outfit/Plus Jakarta Sans), `font-mono` for numbers, costs, and flight codes.

---

## 7. Living Documentation Requirement
- Whenever an API endpoint, TypeScript data type, component hierarchy, or dependency is introduced, updated, or deprecated:
  - Update `context.md` in the same commit/turn.
  - Append an entry to the **Changelog** table in `context.md`.

---

## 8. Firebase Authentication & Cloud State Sync
- **Client Firebase Configuration:** Firebase client variables (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, etc.) are public Web SDK identifiers.
- **Graceful Unconfigured Fallback:** The application must never crash if Firebase environment variables are omitted or invalid. All session saving must fall back cleanly to `localStorage['travai_sessions']` in guest mode.
- **User Privacy & Scoping:** When authenticated, user sessions and message histories must be scoped strictly under `users/{uid}/chats/{chatId}` in Firestore.
