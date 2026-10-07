# Assembly v2.1 — Final Platform

This is the final feature-complete Assembly build.

## Final platform
- Role-based authentication: Founder, Organizer, Member
- Server-side permissions
- Events, registrations, attendance and reusable activities
- Competitions, published results and winner achievements
- Achievements and celebration-ready notifications
- Announcements with audience targeting
- Member-only gallery
- Member profiles and participation history
- Founder analytics and audit log foundation
- Installable PWA manifest and service worker notification foundation
- SQLite local/self-hostable database
- Privacy-first member visibility

## Production notes
- Set `ASSEMBLY_DEV_PASSWORD` before initializing production users.
- Use HTTPS in production so secure cookies and browser notification APIs work correctly.
- Back up `data/assembly.sqlite` regularly.
- The development seed accounts are for testing; replace or disable them before real use.
- Photo records intentionally use URLs in this zero-cost build rather than a paid storage provider.
