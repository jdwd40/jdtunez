# Music Site — Project Specification

## Decisions & Assumptions

These resolve ambiguities upfront so every milestone has a clear target.

| Decision | Resolution |
|---|---|
| **App architecture** | Single Page App (SPA) built with **Vite + vanilla JS modules**. One `index.html` entry point. Client-side routing via the History API so the `<audio>` element persists across view changes and music never interrupts. Production build via `npm run build` outputs to `dist/`. |
| **Anonymous vs authenticated UX** | Anon users can browse albums, play tracks, and see global average ratings. Only authenticated users can rate tracks. A login prompt appears on rating interactions for anon users. |
| **Signup flow** | The `/login` view handles both login and signup via a toggle. Email/password only. No email confirmation required for dev; enable confirm-on-signup before production deploy. |
| **Rating scale** | 1–5 stars. A rating of 0 is not stored — it means "no rating." To clear a rating, delete the row from `track_ratings`. The DB constraint stays `between 0 and 5` as a safety net, but the UI never writes 0. |
| **Play count trigger** | A play is counted once per track per play instance. When a track starts, set `hasCounted = false`. On `timeupdate`, if `!hasCounted && currentTime >= 5 && !audio.seeking`, call `incrementPlayCount(trackId)` and set `hasCounted = true`. Replaying the same track counts again. |
| **Shuffle algorithm** | Fisher-Yates on the full track list at queue creation time. No-repeat-until-exhausted. Reshuffle when the queue loops. |
| **`library.json` sync direction** | One-way: `library.json` → Supabase. Never edit track metadata directly in Supabase. A `scripts/seed.js` script handles upsert (insert or update on conflict). Run it any time `library.json` changes. |
| **Rating stats** | Global stats come from RPC `get_track_rating_stats()` (primary). An optional view with `security_invoker` is only a fallback if your Postgres supports it; do not rely on it for the app. |
| **Supabase config** | **App:** URL and anon key in `src/config.js` (gitignored), `src/config.example.js` committed. **Seed script:** reads `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from environment (e.g. `.env` via `dotenv`). This keeps app config and server/seed config separate so Cursor does not mix them. |
| **Error handling** | Every Supabase call is wrapped in a try/catch. Errors are logged to console and shown to the user via a toast/snackbar component in `ui.js`. Network failures during playback do not interrupt audio. |
| **Audio range requests** | Nginx config must include `accept_ranges` and correct MIME types for `.mp3`. Verify with `curl -I` on deploy. |

---

## File & Folder Blueprint

```
music-site/
├── index.html                    ← single entry point (Vite injects src/main.js)
├── vite.config.js
├── package.json
├── data/
│   └── library.json
├── scripts/
│   └── seed.js                   ← Node script: reads library.json, upserts into Supabase
├── src/
│   ├── config.js                 ← gitignored (Supabase URL + anon key)
│   ├── config.example.js         ← committed with placeholders
│   ├── main.js                   ← app entry: inits router, auth listener, player bar
│   ├── router.js                 ← History API router, mounts/unmounts views
│   ├── supabaseClient.js         ← initialises and exports the Supabase client
│   ├── auth.js                   ← login, signup, logout, session listener
│   ├── library.js                ← fetches and parses data/library.json
│   ├── supabaseApi.js            ← all DB queries: tracks, ratings, play counts
│   ├── player.js                 ← audio engine, queue, transport controls
│   ├── ratings.js                ← star component, read/write user + global ratings
│   ├── radio.js                  ← builds queues for All Songs / Top Rated modes
│   ├── views/
│   │   ├── homeView.js           ← albums grid + radio links (route: /)
│   │   ├── albumView.js          ← album tracklist (route: /album/:id)
│   │   ├── radioView.js          ← radio queue display (route: /radio/:mode)
│   │   └── loginView.js          ← login/signup form (route: /login)
│   ├── ui.js                     ← shared DOM helpers: toast, nav state, auth prompt
│   └── styles.css
├── nginx/
│   └── music-site.conf           ← Nginx server block config for deploy
└── .gitignore
```

---

## Data Shapes

### `library.json`

```json
{
  "albums": [
    {
      "id": "alb_ebonstatic_01",
      "title": "Versions of Silence",
      "artist": "Ebon Static",
      "year": 2026,
      "cover": "/media/versions-of-silence/cover.jpg"
    }
  ],
  "tracks": [
    {
      "id": "trk_vos_01",
      "albumId": "alb_ebonstatic_01",
      "title": "Persona Zero",
      "trackNumber": 1,
      "durationSeconds": 240,
      "audio": "/media/versions-of-silence/01-persona-zero.mp3"
    }
  ]
}
```

Note: `durationSeconds` is optional in the JSON — if omitted, the seed script should leave the DB column null and the player can read duration from the `<audio>` element's `loadedmetadata` event.

### Supabase Tables

**`tracks`** — seeded from `library.json`, never written to by the app.

| Column | Type | Notes |
|---|---|---|
| id | text PK | Stable ID from library.json, e.g. `trk_vos_01` |
| album_id | text | FK-like reference, not enforced (no albums table) |
| title | text | |
| audio_path | text | Relative path served by Nginx |
| cover_path | text nullable | Inherited from album cover in seed script |
| track_number | int | |
| duration_seconds | int nullable | |
| is_published | boolean default true | |
| created_at | timestamptz | |

**`track_ratings`** — user ratings, composite PK.

| Column | Type | Notes |
|---|---|---|
| track_id | text FK → tracks | |
| user_id | uuid FK → auth.users | |
| rating | int CHECK 0–5 | App only writes 1–5; 0 is a DB safety net |
| updated_at | timestamptz | |

**`track_play_counts`** — incremented via RPC only.

| Column | Type | Notes |
|---|---|---|
| track_id | text PK FK → tracks | |
| play_count | bigint default 0 | |
| updated_at | timestamptz | |

### Source of truth (Cursor guardrail)

- **`library.json` is the UI truth:** albums, tracks, paths, ordering. Album and track listing in the app comes from `library.getAlbum()`, `library.getAlbumTracks(albumId)`, etc.
- **Supabase `tracks`** mirrors library.json for: `is_published`, joins for rating stats and play counts, and building radio queues (with published filter). Do not build album/track listing UI from Supabase; use library.json. Use `fetchTracks()` / Supabase only for metrics, filtering by published, or radio queue assembly.

---

## Module Exports (contract for each file)

```
config.js
  export const SUPABASE_URL
  export const SUPABASE_ANON_KEY

main.js
  // App entry point — no exports, runs on load:
  // 1. Init router
  // 2. Init auth listener (update nav on auth change)
  // 3. Mount persistent player bar into #player-bar
  // 4. Load library.json once and cache in memory

router.js
  export function navigateTo(path)         // pushState + render
  export function initRouter()             // listen to popstate, do initial render
  // Routes:
  //   /              → homeView
  //   /album/:id     → albumView
  //   /radio/:mode   → radioView (mode = "all" | "top")
  //   /login         → loginView
  // The router mounts views into a #app container div.
  // The <audio> element and player bar live OUTSIDE #app so they persist.

supabaseClient.js
  export const supabase          // initialised client instance

auth.js
  export async function signUp(email, password)
  export async function signIn(email, password)
  export async function signOut()
  export function onAuthChange(callback)   // wraps onAuthStateChange
  export function getUser()                // returns current user or null

library.js
  export async function loadLibrary()      // returns { albums, tracks }
  export function getAlbum(albumId)
  export function getAlbumTracks(albumId)

supabaseApi.js
  export async function fetchTracks()                    // all published (for radio queue / filtering)
  export async function fetchTrackRatingStats()          // calls supabase.rpc('get_track_rating_stats')
  export async function fetchUserRatings(userId)         // all of a user's ratings
  export async function upsertRating(trackId, rating)    // 1–5
  export async function deleteRating(trackId)            // clear rating
  export async function incrementPlayCount(trackId)      // calls RPC

player.js
  export function playTrack(track)
  export function playQueue(queue, startIndex)
  export function next()
  export function prev()
  export function toggle()                  // play/pause
  export function seek(seconds)
  export function getState()                // { track, queue, index, playing, currentTime, duration }
  export function onStateChange(callback)   // fires on play, pause, track change, time update

ratings.js
  export function renderStars(container, trackId)   // mounts star widget
  export function refreshStars(trackId)             // re-fetch and re-render

radio.js
  export async function buildAllSongsQueue()        // Fisher-Yates shuffled
  export async function buildTopRatedQueue()        // sorted by avg desc, filtered

views/homeView.js
  export function render(container)         // albums grid + radio links

views/albumView.js
  export function render(container, albumId)  // album tracklist + play all button

views/radioView.js
  export function render(container, mode)   // queue list + auto-play

views/loginView.js
  export function render(container)         // login/signup form

ui.js
  export function showToast(message, type)          // type: 'info' | 'error'
  export function updateNavAuth(user)               // show/hide login link
  export function promptLogin()                     // navigateTo('/login') or modal
```

---

## SQL (run in Supabase SQL editor)

Copy-paste this entire block. It is idempotent.

```sql
-- ============================================================
-- TABLES
-- ============================================================

create table if not exists tracks (
  id text primary key,
  album_id text not null,
  title text not null,
  audio_path text not null,
  cover_path text,
  track_number int,
  duration_seconds int,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists track_ratings (
  track_id text not null references tracks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating int not null check (rating between 0 and 5),
  updated_at timestamptz not null default now(),
  primary key (track_id, user_id)
);

create table if not exists track_play_counts (
  track_id text primary key references tracks(id) on delete cascade,
  play_count bigint not null default 0,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- RPC: increment play count (security definer — bypasses RLS)
-- ============================================================

create or replace function increment_track_play(p_track_id text)
returns void
language plpgsql
security definer
as $$
begin
  insert into track_play_counts(track_id, play_count, updated_at)
  values (p_track_id, 1, now())
  on conflict (track_id)
  do update set play_count = track_play_counts.play_count + 1,
                updated_at = now();
end;
$$;

-- ============================================================
-- RPC: rating stats (aggregates only, safe for anon)
-- ============================================================

create or replace function get_track_rating_stats()
returns table (
  track_id text,
  avg_rating numeric(10,2),
  rating_count int
)
language sql
security definer
as $$
  select
    t.id as track_id,
    coalesce(avg(r.rating), 0)::numeric(10,2) as avg_rating,
    count(r.rating)::int as rating_count
  from tracks t
  left join track_ratings r on r.track_id = t.id
  where t.is_published = true
  group by t.id;
$$;

-- Optional fallback: if your Postgres/Supabase supports security_invoker
-- you can instead use a view; the app uses the RPC above as primary.

-- ============================================================
-- RLS
-- ============================================================

alter table tracks enable row level security;
alter table track_ratings enable row level security;
alter table track_play_counts enable row level security;

-- tracks: anyone can read published
create policy "tracks are readable"
  on tracks for select
  to anon, authenticated
  using (is_published = true);

-- ratings: users manage their own; they can read only their own (no raw rows for anon)
create policy "users can read own ratings"
  on track_ratings for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users can insert own ratings"
  on track_ratings for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update own ratings"
  on track_ratings for update
  to authenticated
  using (auth.uid() = user_id);

create policy "users can delete own ratings"
  on track_ratings for delete
  to authenticated
  using (auth.uid() = user_id);

-- play counts: readable by all, writable only via RPC
create policy "play counts readable"
  on track_play_counts for select
  to anon, authenticated
  using (true);

create policy "no direct inserts"
  on track_play_counts for insert
  to anon, authenticated
  with check (false);

create policy "no direct updates"
  on track_play_counts for update
  to anon, authenticated
  using (false);
```

**Ratings privacy:** Anon cannot read `track_ratings`. Authenticated users can read only their own rows. Global averages come from the RPC `get_track_rating_stats()` (aggregates only). Do not add policies that let anon or all users read raw ratings.

---

## Milestones

Work through these in order. Complete exit criteria before moving on.

---

### M0 — Project Setup (Vite)

**Do:**
1. Scaffold the project: `npm create vite@latest music-site -- --template vanilla` then restructure to match the blueprint above.
2. Add `"type": "module"` to `package.json` so both Vite and `scripts/seed.js` use ESM (avoids Cursor mixing CJS/ESM).
3. Install dependencies: `npm install @supabase/supabase-js` and for seed: `npm install dotenv`
3. Create `src/config.example.js` with placeholders.
4. Add `.gitignore` (include `src/config.js`, `.env`, `node_modules/`, `dist/`).
5. Set up `index.html` with the persistent DOM skeleton:

```html
<body>
  <nav id="main-nav"><!-- filled by main.js --></nav>
  <div id="app"><!-- views mount here --></div>
  <div id="player-bar"><!-- persistent player, filled by player.js --></div>
  <audio id="audio-el"></audio>
</body>
```

6. `src/main.js` — import styles, log "app loaded" to console.
7. Run `npm run dev` — verify Vite dev server starts and `index.html` loads with no errors.

**Exit criteria:** `npm run dev` serves the app, `index.html` renders with the skeleton markup, console shows no errors, ES module imports work.

---

### M1 — Supabase Setup

**Do:**
1. Create Supabase project.
2. Enable Email/Password auth (disable email confirmation for dev).
3. Run the full SQL block above in the SQL editor.
4. Copy your project URL and anon key into `src/config.js`.

**Exit criteria:** Tables exist, RLS is enabled, RPCs `increment_track_play` and `get_track_rating_stats` exist. Verify by running `select * from tracks` in the SQL editor (should return empty, no errors).

---

### M2 — Library Manifest + Seed Script

**Do:**
1. Populate `data/library.json` with your real albums and tracks.
2. Create `scripts/seed.js` — a Node script that:
   - Loads env with `dotenv` (e.g. `import 'dotenv/config'` or load from `.env`) and reads `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (or a dedicated seed key). Do not import `src/config.js` from the seed script.
   - Reads `library.json`
   - For each track, upserts into Supabase `tracks` table (insert on conflict update)
   - Inherits `cover_path` from the album's `cover` field
   - Uses the Supabase JS client (`@supabase/supabase-js`) with the service role key from env
3. Run the seed: `node scripts/seed.js` (with `.env` present, not committed).

**Exit criteria:** Every track in `library.json` exists in the `tracks` table. Running seed twice does not create duplicates.

---

### M3 — SPA Router + View Skeleton

**Do:**
1. `src/router.js` — implement a lightweight History API router:
   - Define route patterns: `/`, `/album/:id`, `/radio/:mode`, `/login`
   - `initRouter()` — listen to `popstate`, parse `window.location.pathname`, call the matching view's `render()` function with `document.getElementById('app')` as the container.
   - `navigateTo(path)` — `history.pushState`, then trigger the same render logic.
   - On no match, render a simple 404 message.
2. Create all four view files in `src/views/` with placeholder content:
   - `homeView.js` — "Home — albums go here" + links to `/album/alb_ebonstatic_01` and `/radio/all`.
   - `albumView.js` — reads `:id` param, shows "Album: {id}".
   - `radioView.js` — reads `:mode` param, shows "Radio: {mode}".
   - `loginView.js` — "Login form goes here".
3. `src/main.js` — import and call `initRouter()`, build nav with links that call `navigateTo()` (intercept `<a>` clicks to prevent full page reloads).
4. Shared nav on every page: Home, Login/Logout link.

**Routing architecture:**
- `#app` is the only DOM node that changes on navigation.
- `#player-bar`, `#main-nav`, and `<audio>` live outside `#app` and are never destroyed.
- Each view's `render(container, ...params)` function clears the container and builds its DOM. No framework, just `innerHTML` or `createElement`.
- All internal links use `<a href="/path" data-link>`. **Link interception rules:** only intercept clicks on elements with `data-link`. Do **not** intercept if: `e.metaKey || e.ctrlKey || e.shiftKey || e.altKey`; or `e.button !== 0` (not left click); or `target="_blank"`; or `href` starts with `http` (external). Otherwise call `e.preventDefault()` and `navigateTo(href)`.

**Exit criteria:** All four routes render their placeholder content. Clicking nav links changes the URL and view without a full page reload. Browser back/forward works. The `<audio>` element in `#player-bar` remains in the DOM across all navigations (verify via DevTools).

---

### M4 — Supabase Client + Auth

**Do:**
1. `supabaseClient.js` — import `createClient` from `@supabase/supabase-js` (installed via npm, bundled by Vite), initialise with config values, export client.
2. `auth.js` — implement `signUp`, `signIn`, `signOut`, `onAuthChange`, `getUser`.
3. `views/loginView.js` — wire up form with toggle between Login and Sign Up modes. On successful login, `navigateTo('/')`.
4. `main.js` — on app init, call `onAuthChange` to update nav (show username + Logout link, or Login link).

**Exit criteria:** User can sign up, log in, see their email in nav, log out. Session persists on page refresh (Supabase stores tokens in localStorage). Navigating between views does not lose auth state.

---

### M5 — Player Engine

**Do:**
1. `player.js` — grab the existing `<audio id="audio-el">` element (created in `index.html`, persists across views), manage queue + index + state.
2. Expose all functions per the module contract above.
3. Build the sticky player bar inside `#player-bar`:
   - Track title + album art thumbnail
   - Play/pause, prev, next buttons
   - Progress bar (clickable to seek)
   - Current time / duration display
4. Player bar updates via `onStateChange`.
5. Player bar is built once in `main.js` on app init — it is never destroyed by route changes.

**Play count hook:** `onStateChange` fires an event that M6 will listen to. For now, just ensure `onStateChange` provides `currentTime`.

**Exit criteria:** Click a track on the album page → it plays. Click album "Play All" → queue loads, next/prev cycle through tracks. Navigate to a different view mid-playback → audio continues uninterrupted and player bar remains visible. Player bar reflects current state on all views.

---

### M6 — Play Counts

**Do:**
1. In `player.js`, add play count logic (simple crossing check, no seek heuristic):
   - When a new track starts (or the same track replays), set `hasCounted = false`.
   - On `timeupdate`: if `!hasCounted && audio.currentTime >= 5 && !audio.seeking`, then call `incrementPlayCount(trackId)` and set `hasCounted = true`.
2. Since this is an SPA, the `<audio>` element persists and `hasCounted` lives in module scope — no need for `Set` or nonce tracking across page loads.

**Exit criteria:** Play a track for >5 seconds → `track_play_counts` row increments by 1 in Supabase. Replaying the same track increments again. Seeking to 0:06 does not count. Navigating views mid-track does not double-count or lose the count state.

---

### M7 — Ratings UI

**Do:**
1. `ratings.js` — render a 5-star widget.
   - Always show global average (filled stars proportional to avg, e.g. 3.5 = 3.5 filled).
   - If logged in, show the user's own rating as highlighted stars on hover/click.
   - Click a star → `upsertRating(trackId, n)`.
   - Click the same star again → `deleteRating(trackId)` (toggle off).
   - If not logged in, click → `promptLogin()`.
2. `supabaseApi.js` — implement `fetchTrackRatingStats`, `fetchUserRatings`, `upsertRating`, `deleteRating`.
3. Show star widget on album page (per track) and in the player bar.

**Exit criteria:** Logged-in user can rate a track 1–5, see their rating persist on refresh, clear it. Global average updates reflect all users' ratings (test with two accounts).

---

### M8 — Radio Modes

**Do:**
1. `radio.js`:
   - `buildAllSongsQueue()` — fetch all published tracks, Fisher-Yates shuffle, return as queue.
   - `buildTopRatedQueue()` — fetch `track_rating_stats` joined with `tracks`, filter `rating_count >= 3`, sort by `avg_rating` desc then `rating_count` desc, return as queue.
2. `views/radioView.js`:
   - Read `:mode` param from the router (`"all"` or `"top"`).
   - Build the appropriate queue.
   - Auto-play the first track.
   - Display the queue as a scrollable list, highlight current track.
   - If Top Rated has no qualifying tracks, show a message: "Not enough rated tracks yet. Rate some songs to build this playlist!"

**Exit criteria:** All Songs Radio plays shuffled tracks with no repeats until exhausted. Top Rated Radio plays correctly filtered and sorted tracks. Queue displays correctly and advances. Navigating away and back to radio does not restart the queue if music is still playing.

---

### M9 — VPS Deploy

**Do:**
1. Build the app: `npm run build` — outputs to `dist/`.
2. Upload to VPS:
   - `dist/` → `/var/www/music-site/dist/` (the built app)
   - `data/` → `/var/www/music-site/data/` (library.json, fetched at runtime)
   - Media files → `/var/www/music-site/media/` (MP3s + cover art, NOT inside dist)
3. Configure Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/music-site/dist;
    index index.html;

    # SPA fallback — all routes serve index.html, client router handles the rest
    location / {
        try_files $uri /index.html;
    }

    # library.json served from outside dist
    location /data/ {
        alias /var/www/music-site/data/;
    }

    # Audio + cover art served from outside dist
    location /media/ {
        alias /var/www/music-site/media/;
        types {
            audio/mpeg mp3;
            image/jpeg jpg jpeg;
            image/png png;
        }
        add_header Accept-Ranges bytes;
    }
}
```

4. Verify audio range requests: `curl -I -H "Range: bytes=0-1023" https://yourdomain.com/media/some-track.mp3` — should return `206 Partial Content`.
5. Enable HTTPS via certbot / Let's Encrypt.
6. Add your domain to Supabase Auth → URL Configuration → Site URL and Redirect URLs.

**Why media lives outside `dist/`:** Vite's build only bundles source code. MP3s and cover art are large binary files managed separately on the VPS filesystem. `library.json` is also outside `dist/` so you can update it without rebuilding.

**Exit criteria:** Site loads over HTTPS, client-side routing works (deep links like `/album/alb_ebonstatic_01` resolve correctly via Nginx fallback), auth works, audio streams with seeking, play counts and ratings function.

---

## Cursor Workflow

1. **Commit `SPEC.md` to the repo root.** Tell Cursor to reference it.
2. **One milestone per session.** Prompt format: "Implement M4 per SPEC.md. Files to create: `supabaseClient.js`, `auth.js`. Exit criteria: user can sign in/out, UI shows logged-in state."
3. **Test before proceeding.** Open browser, verify exit criteria, then start the next milestone.
4. **If Cursor drifts,** paste the relevant module export contract and say "only implement these exports, nothing else."
5. **Keep `library.json` updated** and re-run `seed.js` whenever you add tracks.

### Cursor guardrails (paste into prompts when needed)

- Do not add frameworks (stay Vite + vanilla JS).
- Do not modify SQL policies unless explicitly instructed.
- Respect module exports exactly as listed; do not add or remove exports.
- Do not create additional pages — only the views listed in the spec.

---

## Future Considerations (out of scope, but worth noting)

- **Album ratings / comments:** Could extend the rating system to album-level.
- **Admin panel:** A simple authenticated page to toggle `is_published` without touching the DB directly.
- **Playlist support:** User-created playlists beyond the two radio modes.
- **Progressive Web App:** Add a manifest and service worker for offline-capable playback.
- **View transitions:** Add CSS transitions or a lightweight animation when swapping views for a smoother feel.
- **Keyboard shortcuts:** Space for play/pause, arrow keys for next/prev — ergonomic for a music app.
