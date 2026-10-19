# Kita4U

Kita4U (earlier working title: Care Circle).

Mobile web app prototype for the Sime Darby Property University Hackathon 2026, People track.

## What it is
A resident who lives alone picks a Circle of three trusted people: a neighbour, a family member and a community contact. The app does two jobs.
- Ask: explain a confusing message in simple language, then ask the Circle. Request a simple favour from a neighbour.
- Notice: if the resident misses a daily check-in, the app asks the Circle one person at a time and logs every step. If nobody responds, the case shows as Unresolved.

Promise: Ask when you need. Be noticed when you go quiet.
Claim: shorter time until a human knows. We do not claim to prevent emergencies.

## Honest status
- This is a prototype. All people, messages and times are fictional.
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
1. Open the app and tap "Demo mode". Presets and View as do not need the setup.
2. Use the Demo panel to set the simulated clock and each contact's behaviour.
3. Switch roles (Resident, Neighbour, Family, Community) to see each view.

## Demo script
All times are SIMULATED and staged with the Demo panel. A ribbon at the top of every screen says PROTOTYPE · SAMPLE DATA and shows the simulated clock. Open the app, tap "Demo mode". On every other screen the floating "Demo controls" pill at the bottom right opens the Demo panel (View as shows Aminah, Mei, Daniel and Township Support with their pictures). Add `?clean=1` to the URL for a recording without that pill (a faint button in the bottom-right corner still opens the Demo panel). Resident Home has three main actions: the check-in card with the big "I'm okay" button (Circle ring and caption under it), then "Ask your Circle" (opens a chooser: "Explain a message" or "Ask for a small favour") and "Help your Circle" (one scripted request from Mei).

1. Sample message. Panel: "Sample message". Tap "Suspicious SMS". Wait for "Reading…". Point out the orange "This looks suspicious" box and the DEMO RESULT · SAMPLE MESSAGE tag. Tap "Show message" if you want to see the SMS. Tap "Read aloud". Tap "Ask Daniel" ("Sent to Daniel"). Tap "I'm okay" under "While you're here". Panel: View as Daniel to show Daniel's "Mum sent you a message" card (the sample, its verdict and explanation; read-only, today's latest only).
2. Help. Panel: "Help request" (opens on "Ask Mei to help with groceries?"). Tap "Yes, ask Mei". Panel: View as Mei, tap "Accept", then "Done". Panel: View as Aminah, tap "Ask your Circle", then "Ask for a small favour" to see the tracker, then "Say thanks". Panel: View as Mei to show "Aminah says thanks." After Mei accepts, the resident can open the scripted Message Mei and Call Mei demos. Skip them in the main video.
3. Missed check-in, resolved. Panel: "Missed check-in" (09:00; Mei: Checks but never reports, Daniel: No reply, Township Support: Checks and confirms OK). Home asks "Are you okay today?". Tap +2h (11:00), +1h (12:00: Mei was asked at 11:15 and is checking), +2h (14:00: no outcome from Mei, Daniel asked), +1h (15:00, Township Support confirms). Show Home ("Township Support checked on you at 15:00"), then View as Daniel ("Township Support reported Mum is OK at 15:00.", chain and timeline: "Mei saw the request and is checking", "Reported OK 15:00") and Township Support (case card: Resolved; Township Support listed as a proposed role).
4. Missed check-in, unresolved. Panel: tap "Missed check-in", then set all three contacts to "No reply" (the preset sets the story behaviours, so change them after it), then +2h four times and +1h (18:00). Home shows "We could not reach anyone yet." (no 999 button on the resident's Home). Family / Community show a red Unresolved with "No one has confirmed yet. If you think she may be in danger, call 999." and a Call 999 button. Never tap it in a demo: it is a real tel:999 link. Tap "I'm okay" on Home: the case closes as "Resolved by Aminah's check-in".

5. Help your Circle (optional). Home: "Help your Circle". "Mei asks: can you take in my parcel?" (DEMO REQUEST · SCRIPTED). Tap "I can help" or "Can't now": the result shows with "Saved in this demo only." Nothing goes to the timeline or the chain.

Needs help: once a contact taps "Needs help", every view (Home, Mei, Daniel, Township Support) shows "If this may be an emergency, call 999.", a red Call 999 button (tel:999, the only phone link in the app) and "Kita4U does not replace emergency services." 999 is not a step in the chain.

Proposed preview: "What's next (proposed)" on Landing, the dashed "Neighbourhood activities (proposed)" card on Home (under Ask and Help), or "Proposed preview" in the Demo panel open a labelled, read-only preview of neighbourhood activities among people in your Circle (PROPOSED FEATURE · SAMPLE CONTENT). It is a product direction, not a feature: nothing in it is stored or works.

Away: in the reminder state, "I'm away" (under the check-in card) opens a day stepper (1 to 14 days, a demo setting, not validated policy). The sheet previews the return time ("Away until tomorrow 09:00" or a weekday such as "Sun 09:00"). "Set away" pauses everything until then; "I'm back" ends it.

Reset (under Advanced in the Demo panel) returns a clean Friday 08:00 with every contact on "No reply", and clears the Circle setup (setup not done, Mei not invited, default help types). The language stays.

## Stack
React, Vite, TypeScript, Tailwind CSS, lucide-react, framer-motion. Deployed on Vercel.