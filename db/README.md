# Assembly database

Assembly now has a portable SQLite schema.

Why SQLite:
- open source
- runs locally
- no paid database service
- easy to back up as one database file
- can later move to another self-hosted database without redesigning Assembly

The application currently still uses the browser development store. v0.8 establishes the real shared-data model before wiring every screen to it.

Production database connection and secure authentication are the next integration step.
