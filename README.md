# Assembly

The Assembly community app and public website.

## Current stage

Stage 1: public PWA shell.

## Principles

- ₹0 operating-cost goal
- Private member information
- Founder-controlled permissions
- Simple, colorful, child-friendly UI
- Portable architecture; avoid paid lock-in

## Run locally

1. Install Node.js.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the local address shown in the terminal.

## Planned folders

- `app/` — screens and global styles
- `public/` — static assets and PWA files
- `components/` — reusable UI components (next)
- `lib/` — application logic and data access (next)
- `types/` — shared TypeScript types (next)
- `data/` — development/sample data only (next)
- `docs/` — architecture and product decisions (next)


## v0.7
Reusable Activities library and event activity selection added.


## v0.8
Portable SQLite database foundation added. The UI remains on development storage until the authenticated API integration is completed.


## v0.9
Real SQLite-backed API routes added for events, activities, registrations, and development login.


## v1.0
Founder and Member event/activity screens connected to the SQLite-backed API.


## v1.1
Secure session/authentication foundation added.


## v1.2
Role-aware private route protection and Organizer dashboard foundation added.


## v1.3
Granular Organizer permission system added with Founder controls and server-side enforcement.

## v1.4
Members management and member profile APIs added.

## v1.5
Event management, publishing, member registration, participant management, and attendance tracking added.

## v1.6
Reusable activity library is now linked to events; Founder can assign activities and members can view event activity lineups.

## v1.7
Competition management, rounds, participants, draft/published results, and member-facing competition results added.

## v1.8
Achievement library, Founder awards, member achievement view, and automatic Competition Winner awarding on published first-place results added.

## v1.9
Database-backed in-app notifications, notification preferences, automatic event/achievement notifications, and achievement celebration UI added.

## v2.0 milestone
Announcements and private/member gallery are now included.
