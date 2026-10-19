# Kita4U

Kita4U (earlier working title: Care Circle).

Mobile web app prototype for the Sime Darby Property University Hackathon 2026, People track.

## What it is
A resident who lives alone has a Circle of three people: a neighbour (Mei), a family member (Daniel) and a proposed community role (Township Support). In this prototype the people and their order are fixed. The app does two jobs.
- Ask: explain a confusing message in simple language, then ask the Circle. Request a simple favour from a neighbour.
- Notice: if the resident misses a daily check-in, the app asks the Circle one person at a time and logs every step. If nobody responds, the case shows as Unresolved.

Promise: Ask when you need. Be noticed when you go quiet.
Aim: shorten the time until a human knows. This has not been measured. We do not claim to prevent emergencies, and Kita4U does not replace emergency services.

What we may and may not say about the prototype: [docs/PITCH-CLAIMS.md](docs/PITCH-CLAIMS.md).

## Honest status
- This is an interactive prototype with simulated data. All people, messages and times are fictional.
- Reminders, contact replies and the clock are simulated. Timings are demo settings, not validated policy; a pilot would agree them with each Circle.
- Township Support is a proposed role, to be agreed in a pilot. No township, guardhouse, neighbour or family has agreed to anything.
- The Circle setup, Mei's invitation (Accept / Decline), help-type switches, the introduction-session choice ("Yes, I'm interested" / "Not now"), "I'm interested" on the preview and Help your Circle are prototype-only state in the browser. Accept or Decline does not change the chain; in a real deployment consent would be enforced by a backend.
- 999 is not a step in the chain. A Call 999 button (tel:999, the only phone link) appears only in Needs help (all views) and in Unresolved for Daniel and Township Support.
- The Activities preview ("Connect with your neighbourhood") is a labelled preview of a proposed expansion. It does not work in the prototype.
- The "What is this?" results are predefined sample responses (labelled DEMO RESULT · SAMPLE MESSAGE). The prototype does not call an AI model.
- Contacts and their replies are simulated by the demo panel. All timings are demo settings, not validated policy.
- The problem has not been validated by interviews yet.
- No login, database, real notifications or location tracking.
- The demo chat and demo call are scripted mock screens. No real message or call is made, and nothing is stored.

Live demo: <https://kita4u.vercel.app/>

## Run locally
npm install
npm run dev

## Try the demo
First visit (the path a resident would see):
1. Landing: tap "Try as Mak Cik Aminah". The first time, this opens the Circle setup.
2. Setup step 1 "Your people": Mei (will be invited), Daniel (family contact, demo), Township Support (proposed role). The order is fixed. Tap Next.
3. Setup step 2 "How can they help?": Groceries and Phone help are on, Clinic ride is off (each switch shows On or Off). Tap Next.
4. Setup step 3 "Meet your Circle": a mock introduction session (proposed, example only). Tap Finish. Home opens; the caption under the Circle ring says Mei has been invited.
5. Mei: Demo controls, View as Mei, tap Accept on "Aminah invited you to her Circle." Back as Aminah, the caption reads "Mei and Daniel agreed".
Accept or Decline is a prototype of consent only. It never changes the chain. Next visits skip the setup; "Show Circle setup" under Advanced in the Demo panel opens it again.

Presenter path:
1. Open the app and tap "Demo mode". Home opens straight away in a prepared demo state: the Normal story, setup marked done and Mei marked as accepted (so the caption reads "Demo Circle. Mei and Daniel agreed. Township role: proposed."). This is prepared demo data, not a real consent. Setup step 1 also has "Skip setup · Try demo".
2. The "Demo controls" pill opens the Demo panel: Next step, the simulated clock (+1h, +2h), stories, View as (Aminah, Mei, Daniel, Township) and each contact's behaviour. While viewing as someone else the pill names them ("Demo controls · Mei").
3. While a case is open, a "Next step" pill beside Demo controls jumps the simulated clock to the next moment something can change.

## Demo script
All times are SIMULATED and staged with the Demo panel. A ribbon at the top of every screen says PROTOTYPE · SAMPLE DATA and shows the simulated clock. Open the app, tap "Demo mode" (Home opens in the prepared demo state). On every other screen the floating "Demo controls" pill at the bottom right opens the Demo panel (View as: Aminah, Mei, Daniel and Township as a 2x2 grid with their pictures). Back always goes one level up; Done and Back to home go to Home, which comes back at the same scroll position. Add `?clean=1` to the URL for a recording without the pills (a faint button in the bottom-right corner still opens the Demo panel; Next step is then in the panel). Resident Home has three main actions: the check-in card with the big "I'm okay" button (Circle ring and caption under it), then "Ask your Circle" (opens a chooser: "Explain a message" or "Ask for a small favour") and "Help your Circle" (one scripted request from Mei).

1. Sample message. Panel: "Sample message". Tap "Suspicious SMS". Wait for "Reading…". Point out the orange "This looks suspicious" box and the DEMO RESULT · SAMPLE MESSAGE tag. Tap "Show message" if you want to see the SMS. Tap "Read aloud". Tap "Ask Daniel" ("Sent to Daniel"), then "Done" (back to Home). Panel: View as Daniel to show Daniel's "Mum sent you a message" card (the sample, its verdict and explanation; read-only, today's latest only).
2. Help. Panel: "Help request" (opens on "Ask Mei to help with groceries?"). Tap "Yes, ask Mei". Panel: View as Mei, tap "Accept", then "Done". Panel: View as Aminah, tap "Ask your Circle", then "Ask for a small favour" to see the tracker, then "Say thanks". Panel: View as Mei to show "Aminah says thanks." After Mei accepts, the resident can open the scripted Message Mei and Call Mei demos. Skip them in the main video.
3. Missed check-in, resolved. Panel: "Missed check-in" (09:00; Mei: Checks but never reports, Daniel: No reply, Township Support: Checks and confirms OK). Home asks "Are you okay today?". Tap +2h (11:00), +1h (12:00: Mei was asked at 11:15 and is checking), +2h (14:00: no outcome from Mei, Daniel asked), +1h (15:00, Township Support confirms). Or tap "Next step" 7 times: 09:15 reminder, 11:15 Mei asked, 11:30 Mei is checking, 12:30 no outcome from Mei and Daniel asked, 14:30 no reply from Daniel and Township Support asked, 14:45 Township Support is checking, 15:00 reported OK; then Next disappears. Show Home ("Township Support checked on you at 15:00"), then View as Daniel ("Township Support reported Mum is OK at 15:00.", chain and timeline: "Mei saw the request and is checking", "Reported OK 15:00") and Township Support (case card: Resolved; Township Support listed as a proposed role).
4. Missed check-in, unresolved. Panel: tap "Missed check-in", then set all three contacts to "No reply" (the preset sets the story behaviours, so change them after it), then +2h four times and +1h (18:00). Or tap "Next step" 5 times: 09:15, 11:15 Mei asked, 13:15 Daniel asked, 15:15 Township Support asked, 17:15 no reply, case Unresolved (the same end state; the clock stops at 17:15 instead of 18:00). Home shows "We could not reach anyone yet." (no 999 button on the resident's Home). Family / Community show a red Unresolved with "No one has confirmed yet. If you think she may be in danger, call 999." and a Call 999 button. Never tap it in a demo: it is a real tel:999 link. Tap "I'm okay" on Home: the case closes as "Resolved by Aminah's check-in".

5. Help your Circle (optional). Home: "Help your Circle". "Mei asks: can you take in my parcel?" (DEMO REQUEST · SCRIPTED). Tap "I can help" or "Can't now": the result shows with "Saved in this demo only." Nothing goes to the timeline or the chain.

Needs help: once a contact taps "Needs help", every view (Home, Mei, Daniel, Township Support) shows "If this may be an emergency, call 999.", a red Call 999 button (tel:999, the only phone link in the app) and "Kita4U does not replace emergency services." 999 is not a step in the chain.

Proposed preview: "What's next (proposed)" on Landing, the dashed "Activities (proposed)" card on Home (under Ask and Help), or "Proposed preview" in the Demo panel open a labelled, read-only preview of neighbourhood activities among people in your Circle (PROPOSED FEATURE · SAMPLE CONTENT). It is a product direction, not a feature: nothing in it is stored or works.

Away: in the reminder state, "I'm away" (under the check-in card) opens a day stepper (1 to 14 days, a demo setting, not validated policy). The sheet previews the return time ("Away until tomorrow 09:00" or a weekday such as "Sun 09:00"). "Set away" pauses everything until then; "I'm back" ends it.

Reset (under Advanced in the Demo panel) returns a clean Friday 08:00 with every contact on "No reply", and clears the Circle setup (setup not done, Mei not invited, default help types). The language stays.

## Stack
React, Vite, TypeScript, Tailwind CSS, lucide-react, framer-motion. No router, backend, login or database: state lives in the browser's localStorage (care-circle-state, care-circle-circle, care-circle-lang). Deployed on Vercel.