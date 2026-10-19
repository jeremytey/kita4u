# Kita4U: build rules

Kita4U (earlier working title: Care Circle).

Mobile web app prototype for a hackathon demo. One developer, speedrun build. Priority: ship a convincing, good-looking demo. Do not over-engineer.

## Stack
React + Vite + TypeScript, Tailwind CSS v4 (@tailwindcss/vite), lucide-react, framer-motion. Nothing else.
No router: use a simple `screen` state. No backend, no login, no database, no real notifications, no live AI call, no Docker.
Persist events in localStorage. A Reset button clears them.

## Product in one line
A resident living alone has a Circle (Mei = neighbour, Daniel = son, Township Support = community contact). The app lets her understand a message and ask her Circle, request a simple favour, and check in. If she misses her check-in, the Circle is asked one person at a time and every step is logged.
Persona: Mak Cik Aminah, Unit 12-3. Everything is fictional.

## Language rules
- Say "resident". Do not say "senior" in the UI.
- Never write "scam". Write "looks suspicious".
- Never claim the app "prevents" emergencies.
- A top ribbon on every screen (Landing and ?clean=1 too) says PROTOTYPE · SAMPLE DATA and SIMULATED TIME · {clock}. There are no per-time SIMULATED tags. SIMULATED stays on chain status pills; the Demo reply label, the DEMO RESULT · SAMPLE MESSAGE tag and the Sample history tag also stay.
- Never imply a real township, guardhouse, management team or neighbour agreed to anything.
- "Not an emergency service" goes in the Home footer. 999 wording follows Phase 12 decision 5 (below): Needs help in all views, Unresolved in Daniel and Township views only.
- No live location tracking. Say so on the Family screen.
- The chat and call screens are labelled DEMO CHAT / DEMO CALL. No phone number, no tel: link, no free text. The one exception is the contextual Call 999 button (tel:999) in the Needs help and Unresolved states (Phase 12 decision 5). It is the only tel: link in the app.

## Escalation rules (the core logic)
All times are SIMULATED. Delays are demo settings, not validated policy.
- Check-in window ends 09:00. If no CHECK_IN today and not Away, a case opens.
- 09:15 reminder to the resident.
- Contacts in order: Neighbour, Family, Community. First contact is alerted at 11:15 (reminder + 2h).
- A contact taps "I'll check" = HUMAN_AWARE. Then they have 1 simulated hour to record an outcome.
- If there is no outcome in 1 hour, escalate to the next contact. The earlier contact stays marked "Human aware". The case stays "Being checked".
- A contact taps "Can't now", or does not reply within 2 simulated hours of being alerted: escalate to the next contact.
- "She's OK" resolves the case. It is NOT a resident check-in. Home says "Mei checked on you at 11:40."
- "Needs help" alerts all remaining contacts at once and shows the 999 line from Phase 12 decision 5.
- Resident taps "I'm okay": records a check-in and closes any open case.
- Resident taps "I'm away" (until tomorrow 09:00 or until Sunday 09:00): pauses everything. "I'm back" ends it.
- Last contact gets no reply in 2h, or says "I'll check" with no outcome in 1h: case is UNRESOLVED (red). We never claim a human responded.
- Using the message helper or requesting a favour has NO effect on check-in status.

## Engine
- Events: { type, time, actor, meta }. Types: CHECK_IN, AWAY, BACK, MESSAGE_CHECKED, ASKED_CIRCLE, HELP_REQUESTED, HELP_ACCEPTED, HELP_DONE, THANKS, ALERTED, CANT_NOW, HUMAN_AWARE, CONTACT_OK, NEEDS_HELP.
- One pure function: deriveChain(events, now, behaviours) returns the four chain steps plus the case status. No setTimeout, no setInterval. The demo clock is just `now`.
- Demo behaviours (per contact, set in the demo panel): "No reply", "Can't now", "Checks and confirms OK", "Checks but never reports". The behaviour only applies if the user has not tapped a real button on that contact's screen. Behaviour replies arrive 15 simulated minutes after the alert, and the confirmation 15 minutes after that.
- Keep it small. No event sourcing library, no state library. React useState/useReducer + context is enough.
- Write src/lib/engine.selftest.ts with plain assertions and run it with `npx tsx src/lib/engine.selftest.ts` after changing the engine.

## Chain bar (signature visual)
Vertical line, four steps: You, Neighbour, Family, Community. Each step has an icon, label and time.
States: Waiting (empty grey circle), Asked (amber dot, "Asked 11:15"), No reply (grey dot with minus icon, "No reply 13:15"), Responded (green tick, "Mei is checking 11:30"; if no outcome later, add "No outcome 12:30"), Not needed (faded).
Used on Family and Community only. Never on resident Home: the resident gets one plain sentence instead.

## Screens
Landing, Home (states: normal, checked in, reminder, chain running, away, contact checked), What is this? (choose, reading, result, sent), I need help (pick, confirm, status, done), Contact welfare card, Neighbour help card, Family timeline, Community case card (thin: no charts), Demo panel.
Roles: Resident, Neighbour, Family, Community, switched from the demo panel.
Home layout, top to bottom: name and status sentence, the check-in card (orange; green when done; white while away) holding the icon tile, eyebrow and heading, the Circle ring (CircleRing, numbered 1/2/3, max 240px, tone matching the card), one caption line (circleCaption), then the one hero "I'm okay" button (I'm back while away, Checked in {time} when done), I'm away (reminder state only), the Ask section, footer. Until 12C the Ask section is "Need something? Ask your Circle" with two full-width action cards (Explain a message, Ask for a small favour); in 12C it becomes two actions, Ask your Circle and Help your Circle. There is no separate "I need help" button: the favour flow opens from Ask. Red box only for Needs help and Unresolved.
The Circle ring (src/components/CircleRing.tsx) is on Landing and inside the Home check-in card. The Circle card (CircleStrip) is no longer rendered; the file stays because Avatar and PEOPLE are exported from it. Avatars are illustrated badges (src/components/avatars.tsx), named "Name, Role".
Demo bar: one floating "Demo controls" pill at the bottom right of the phone column. The clock lives in the ribbon.

## Message helper (simulated)
Three predefined samples: Suspicious SMS, Electricity bill, Township notice. Each has a fictional message, a two-sentence explanation, and a suspicious flag. Show a thumbnail drawn in HTML/CSS (a message card), not an image file. No Take photo button. Always show the tag DEMO RESULT · SAMPLE MESSAGE. Buttons: Ask Daniel, Read aloud, Done. The message itself sits behind a Show message toggle. Under the buttons: "While you're here: tap I'm okay."
Read aloud uses window.speechSynthesis. If no voice exists for the chosen language, disable the button and show "Voice not available on this device".

## Design
Follow the accessible-ui skill. It overrides any "bold, distinctive" advice from the frontend-design plugin. This app should look calm, warm and clear, not experimental.
Tokens: put colours in CSS variables in src/index.css. Warm off-white background, soft warm-orange accent for primary actions, green = done, amber = waiting, grey = no reply/paused, orange box = suspicious, red ONLY for Unresolved and Needs help.
Phone frame: max width 430px, centred on desktop, full screen on a phone.

## Phase 12 decisions
1. Product name is Kita4U. APP_NAME in src/strings.ts is the single source.
2. No new engine states or event types. "Seen" is wording only, tied to existing states:
   Asked = "Mei was asked to check"
   Checking (HUMAN_AWARE) = "Mei saw the request and is checking"
   Confirmed (CONTACT_OK) = "Mei reported Aminah is OK" (on Family, Township and timeline). A report is not verification. Resident Home keeps "Mei checked on you at {time}".
   Never show "saw the request" for the Asked state.
3. Only Mei gets an invitation card (prototype of consent). No Daniel invitation card.
4. Township Support is a proposed role. Wording: "Proposed role, to be agreed in a pilot. Example: township community team or guardhouse." No Accept button.
5. 999 is NOT a step in the chain. Needs help (all views): "If this may be an emergency, call 999." Unresolved (Daniel and Township views only; NOT resident Home, NOT Mei): "No one has confirmed yet. If you think she may be in danger, call 999." Both add "Kita4U does not replace emergency services." One contextual tel:999 button in those states only. It is the only tel: link in the app. Replaces the old CLAUDE.md 999 rule.
6. New screens use a local type in App.tsx: AppScreen = Screen | 'setup' | 'askChooser' | 'helpCircle' | 'activities'. types.ts is frozen.
7. New Circle state lives in src/lib/circle.ts with its own localStorage key 'care-circle-circle'. "Reset demo" must also clear it. Do not rename existing localStorage keys.
8. Do NOT delete src/components/CircleStrip.tsx. Avatar and PEOPLE are exported from it and about 10 files import them. Stop rendering the Circle card on Home only.
9. Demo data is allowed only when labelled (PROTOTYPE · SAMPLE DATA ribbon, DEMO or SAMPLE tags). Evidence-style numbers (residents joined, % who want, participation counts) are never shown.

## Strings
All user-facing text lives in src/strings.ts as { en, bm, zh } objects. Translate only the screens in the demo. Export APP_NAME there (Kita4U, the single source for the product name).

## File layout
src/main.tsx, App.tsx, index.css, strings.ts, types.ts
src/lib/engine.ts, engine.selftest.ts, store.ts (events + localStorage), speech.ts, samples.ts
src/components/ (Card, BigButton, CircleStrip, avatars, ChainBar, TopBar, DemoPanel, PhoneFrame)
src/screens/ (Landing, Home, WhatIsThis, NeedHelp, ContactCard, NeighbourHelp, Family, Community)

## Working rules
- Every phase must leave the app runnable. Run `npm run build` before you finish a phase.
- Do not add features, libraries or screens that are not in this file. If something seems missing, ask.
- Keep components small and plain. No abstraction for its own sake.
- End each phase with: what to look at in the browser (3 bullets max).