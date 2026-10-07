# Events v0.6 — Live development flow

The event flow now works in-browser using localStorage:
Founder creates an event -> event is stored -> published events appear on the Member Events page -> a development member can register -> Founder Events shows registration count.

This is intentionally a development data store, not production authentication/database. The next production step is to replace localStorage with a real persistent backend while preserving the same data model.
