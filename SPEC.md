# JDTunes - SPECS.md

## 1. Project Overview

**JDTunes** is a music web app for showcasing and streaming original music.

The app allows visitors to browse bands, albums, and tracks, then play either full albums or individual tracks through a persistent music player that remains available across the app.

The app also includes an admin area where the site owner can manage music content and artwork.

This project should be built with a **simple MVP-first mindset**:
- mobile-first
- lightweight
- fast to use
- easy to host on a VPS
- easy to expand later

Preferred stack:
- **Frontend:** Vite + React
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Storage:** audio files and images stored on the server filesystem

---

## 2. Core Goals

### User goals
- Browse available music by band and album
- View album and track artwork
- Play a full album in order
- Play individual tracks
- Keep the music player visible and usable while navigating between pages
- Have a clean experience on mobile, tablet, and desktop

### Admin goals
- Upload tracks
- Add band names
- Edit band names
- Delete band names
- Add album titles
- Edit album titles
- Delete album titles
- Upload album art
- Upload track art
- Upload band art
- Manage which tracks belong to which album and band

---

## 3. MVP Scope

### Included in MVP
- Public music browsing UI
- Public band pages
- Public album pages
- Track listing UI
- Persistent audio player across all views/pages
- Admin login
- Admin dashboard
- CRUD for bands
- CRUD for albums
- CRUD for tracks
- Upload and display of:
  - band art
  - album art
  - track art
  - audio files

### Not included in MVP
- User accounts for listeners
- Likes, ratings, comments, or favorites
- Playlists created by users
- Search with advanced filtering
- Social features
- Payments or subscriptions
- Analytics beyond very basic optional play counts
- Multi-admin roles and permissions

---

## 4. User Roles

### Public user
Can:
- view bands
- view albums
- view tracks
- play albums
- play individual tracks
- use persistent player

### Admin
Can:
- log in securely
- create, edit, delete bands
- create, edit, delete albums
- create, edit, delete tracks
- upload images and audio
- assign tracks to albums and bands
- change display order if implemented in MVP or phase 2

---

## 5. Functional Requirements

## 5.1 Public App

### Home page
Should show:
- featured bands, albums, or latest releases
- a simple clean layout
- quick access to music
- responsive design

### Band page
Should show:
- band name
- band art
- list of albums for that band
- optional list of standalone tracks if needed later

### Album page
Should show:
- album title
- band name
- album art
- track list
- play album button
- ability to play individual tracks

### Track item
Should show:
- track title
- band name
- album title if applicable
- duration if available
- track art if available
- play button

### Persistent music player
Must:
- remain visible at the bottom of the screen across all public pages/views
- continue playback while navigating between pages
- show current track info
- provide play/pause
- provide next/previous track when playing an album or queue
- show progress bar / seek bar
- support volume control on desktop
- remain usable and clean on mobile

### Playback behavior
- User can click **Play Album** to queue all tracks from that album in order
- User can click an individual track to play just that track, or begin playback from that point in album context
- When one track ends, next track should start automatically if part of an album queue
- Player state should be maintained across route changes

---

## 5.2 Admin App

### Admin authentication
Must include:
- secure login form
- protected admin routes
- session or token-based auth
- logout

### Admin dashboard
Should provide clear access to:
- band management
- album management
- track management
- file uploads

### Band management
Admin can:
- add band
- edit band name
- delete band
- upload or replace band art

### Album management
Admin can:
- add album
- edit album title
- delete album
- assign album to band
- upload or replace album art

### Track management
Admin can:
- add track
- edit track title
- delete track
- assign track to album
- assign track to band
- upload audio file
- upload or replace track art
- set track order within album
- set duration automatically if practical, or store manually if needed

### File upload requirements
Admin should be able to upload:
- audio files, initially MP3 minimum
- image files for band art, album art, and track art

Uploads should:
- validate file types
- validate max file size
- store safe filenames or generated unique filenames
- save file path references in the database

---

## 6. UX / UI Requirements

The app should feel similar in spirit to **Suno** in terms of ease of use and persistent playback, but simpler.

### Design priorities
- mobile-first layout
- clean and modern UI
- minimal friction to start music playback
- clear visual hierarchy
- strong artwork presentation
- bottom player always accessible

### Responsive requirements

#### Mobile
- stacked layout
- bottom player optimized for touch
- artwork and controls sized for phone screens
- menus simplified

#### Tablet
- more breathing room in layout
- better use of horizontal space
- persistent player still docked at bottom

#### Desktop
- richer multi-column layouts where useful
- more visible metadata and artwork
- room for extra player controls like volume and queue

---

## 7. Suggested Information Architecture

### Public routes
- `/` - home
- `/bands` - optional band list page
- `/bands/:bandId` - band page
- `/albums/:albumId` - album page
- `/tracks/:trackId` - optional track detail page if needed

### Admin routes
- `/admin/login`
- `/admin`
- `/admin/bands`
- `/admin/albums`
- `/admin/tracks`
- `/admin/uploads` - optional if separated

---

## 8. Data Model - MVP

## 8.1 Bands
Fields:
- id
- name
- slug
- art_path
- created_at
- updated_at

## 8.2 Albums
Fields:
- id
- band_id
- title
- slug
- art_path
- release_date (optional)
- created_at
- updated_at

## 8.3 Tracks
Fields:
- id
- band_id
- album_id
- title
- slug
- audio_path
- art_path
- duration_seconds
- track_number
- created_at
- updated_at

### Relationships
- one band has many albums
- one band has many tracks
- one album belongs to one band
- one album has many tracks
- one track belongs to one band
- one track may belong to one album

---

## 9. Backend Requirements

### API responsibilities
Backend should handle:
- auth for admin
- CRUD for bands
- CRUD for albums
- CRUD for tracks
- file upload handling
- serving uploaded images
- streaming audio files

### Audio streaming
Audio playback should support:
- HTTP range requests
- seeking within tracks
- stable streaming from local server storage

This is important so playback works properly in browser audio players.

### Validation
Backend should validate:
- required fields
- valid entity relationships
- file types
- file sizes
- safe deletion behavior

### Deletion behavior
Need defined rules:
- deleting a band should either:
  - block delete if albums/tracks exist, or
  - cascade delete carefully
- deleting an album should define what happens to its tracks
- deleting a track should remove or preserve files depending on chosen implementation

For MVP, prefer **safe blocking or explicit confirmation logic** rather than automatic destructive cascade.

---

## 10. Frontend Requirements

### State management
Frontend should manage:
- current playing track
- current queue / album queue
- playback state
- player visibility
- current progress

The player should ideally use:
- React context, Zustand, or similarly simple global state

### Key frontend behaviors
- route changes must not stop music
- player remains mounted globally
- loading states should be clear
- empty states should be handled gracefully
- artwork fallback should exist when no image is uploaded

---

## 11. Suggested API Endpoints

## Auth
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/me`

## Bands
- `GET /api/bands`
- `GET /api/bands/:id`
- `POST /api/bands`
- `PUT /api/bands/:id`
- `DELETE /api/bands/:id`

## Albums
- `GET /api/albums`
- `GET /api/albums/:id`
- `POST /api/albums`
- `PUT /api/albums/:id`
- `DELETE /api/albums/:id`

## Tracks
- `GET /api/tracks`
- `GET /api/tracks/:id`
- `POST /api/tracks`
- `PUT /api/tracks/:id`
- `DELETE /api/tracks/:id`

## Uploads / Media
- `POST /api/uploads/band-art`
- `POST /api/uploads/album-art`
- `POST /api/uploads/track-art`
- `POST /api/uploads/audio`

## Streaming
- `GET /media/audio/:filename`
- `GET /media/images/:filename`

---

## 12. Storage Strategy

### Database stores
- metadata
- relationships
- filenames / paths
- ordering data

### Filesystem stores
- audio files
- image files

Suggested folder structure on server:
- `/uploads/bands`
- `/uploads/albums`
- `/uploads/tracks`
- `/uploads/audio`

---

## 13. Security Requirements

- admin routes must be protected
- passwords must be hashed securely
- uploaded filenames must be sanitized or replaced
- file upload limits must be enforced
- only allowed MIME/file types accepted
- server should not expose unrestricted filesystem access
- auth cookies or tokens should be handled securely

---

## 14. Error Handling Requirements

Public app should handle:
- missing artwork
- empty albums
- missing tracks
- failed playback
- slow loading

Admin app should handle:
- upload failures
- validation errors
- delete failures
- invalid login attempts

Responses should be clear and useful, not vague.

---

## 15. Non-Functional Requirements

- app should be lightweight enough for VPS hosting
- should load quickly on mobile connections
- should be easy to deploy and maintain
- should avoid unnecessary complexity
- should be structured so future features can be added cleanly

---

## 16. Phase 2 Ideas

Possible later additions:
- drag-and-drop track ordering
- featured albums section
- search
- listener accounts
- likes / favorites
- playlists
- play counts
- genre tags
- release year filters
- analytics dashboard
- multiple admin users

---

## 17. Open Decisions

These should be decided early:
1. Will tracks always belong to an album, or can tracks exist independently?
2. Should deleting a band/album be blocked when child records exist?
3. Should uploaded files be deleted from disk when records are deleted?
4. Will admin upload track duration manually or should backend detect it?
5. Will there be one band only at first, or should full multi-band support remain in MVP?
6. Should the player support a queue beyond single album playback in MVP?

---

## 18. Implementation Guidance for AI Coding Tools

When generating code for this project:
- build MVP first
- keep components small and focused
- prefer simple and maintainable patterns
- avoid over-engineering
- use clear folder structure
- separate public app and admin concerns cleanly
- ensure persistent player architecture is decided early
- implement audio streaming correctly with range request support
- make responsive design a core requirement, not an afterthought

---

## 19. MVP Summary

JDTunes MVP is a responsive music streaming web app with:
- public browsing of bands, albums, and tracks
- a persistent bottom music player across all pages
- album playback and individual track playback
- admin tools for managing bands, albums, tracks, artwork, and audio uploads
- local server file storage and lightweight VPS-friendly architecture

The first version should focus on doing these core features well before adding advanced features.

