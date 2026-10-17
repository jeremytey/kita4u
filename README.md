# Care Circle (working title)

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
1. Open the app and tap "Demo mode".
2. Use the Demo panel to set the simulated clock and each contact's behaviour.
3. Switch roles (Resident, Neighbour, Family, Community) to see each view.

## Demo script
All times are SIMULATED and staged with the Demo panel. A ribbon at the top of every screen says PROTOTYPE · SAMPLE DATA and shows the simulated clock. Open the app, tap "Demo mode". On every other screen the floating "Demo controls" pill at the bottom right opens the Demo panel (View as shows Aminah, Mei, Daniel and Township Support with their pictures). Add `?clean=1` to the URL for a recording without that pill (a faint button in the bottom-right corner still opens the Demo panel). Resident Home has one check-in card with the big "I'm okay" button, then two cards: "Explain a message" and "Ask for a small favour".

1. Sample message. Panel: "Sample message". Tap "Suspicious SMS". Wait for "Reading…". Point out the orange "This looks suspicious" box and the DEMO RESULT · SAMPLE MESSAGE tag. Tap "Show message" if you want to see the SMS. Tap "Read aloud". Tap "Ask Daniel" ("Sent to Daniel"). Tap "I'm okay" under "While you're here". Panel: View as Daniel to show Daniel's "Mum sent you a message" card (the sample, its verdict and explanation; read-only, today's latest only).
2. Help. Panel: "Help request" (opens on "Ask Mei to help with groceries?"). Tap "Yes, ask Mei". Panel: View as Mei, tap "Accept", then "Done". Panel: View as Aminah, tap "Ask for a small favour" to see the tracker, then "Say thanks". Panel: View as Mei to show "Aminah says thanks." After Mei accepts, the resident can open the scripted Message Mei and Call Mei demos. Skip them in the main video.
3. Missed check-in, resolved. Panel: "Missed check-in" (09:00; Mei: Checks but never reports, Daniel: No reply, Township Support: Checks and confirms OK). Home asks "Are you okay today?". Tap +2h (11:00), +1h (12:00: Mei was asked at 11:15 and is checking), +2h (14:00: no outcome from Mei, Daniel asked), +1h (15:00, Township Support confirms). Show Home ("Township Support checked on you at 15:00"), then View as Daniel (chain and timeline) and Township Support (case card).
4. Missed check-in, unresolved. Panel: tap "Missed check-in", then set all three contacts to "No reply" (the preset sets the story behaviours, so change them after it), then +2h four times and +1h (18:00). Home shows "We could not reach anyone yet." and Family / Community show a red Unresolved. Tap "I'm okay" on Home: the case closes as "Resolved by Aminah's check-in".

Away: in the reminder state, "I'm away" (under the check-in card) opens a day stepper (1 to 14 days, a demo setting, not validated policy). The sheet previews the return time ("Away until tomorrow 09:00" or a weekday such as "Sun 09:00"). "Set away" pauses everything until then; "I'm back" ends it.

Reset (under Advanced in the Demo panel) returns a clean Friday 08:00 with every contact on "No reply". The language stays.

## Stack
React, Vite, TypeScript, Tailwind CSS, lucide-react, framer-motion. Deployed on Vercel.