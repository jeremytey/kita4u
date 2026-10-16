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

Live demo: <https://kita4u.vercel.app/>

## Run locally
npm install
npm run dev

## Try the demo
1. Open the app and tap "Demo mode".
2. Use the Demo panel to set the simulated clock and each contact's behaviour.
3. Switch roles (Resident, Neighbour, Family, Community) to see each view.

## Demo script
All times are SIMULATED and staged with the Demo panel. A ribbon at the top of every screen says PROTOTYPE · SAMPLE DATA and shows the simulated clock. Open the app, tap "Demo mode". On every other screen the full-width "Demo controls" handle at the bottom opens the Demo panel. Add `?clean=1` to the URL for a recording without that handle (a faint button in the bottom-right corner still opens the Demo panel). Resident Home has one big "I'm okay" button.

1. Sample message. Panel: "Sample message". Tap "Suspicious SMS". Wait for "Reading…". Point out the orange "This looks suspicious" box and the DEMO RESULT · SAMPLE MESSAGE tag. Tap "Show message" if you want to see the SMS. Tap "Read aloud". Tap "Ask Daniel" ("Sent to Daniel"). Tap "I'm okay" under "While you're here".
2. Help. Panel: "Help request" (opens on "Ask Mei to help with groceries?"). Tap "Yes, ask Mei". Panel: View as Neighbour, tap "Accept", then "Done". Panel: View as Resident, tap "I need help" to see the tracker, then "Say thanks". Panel: View as Neighbour to show "Aminah says thanks."
3. Missed check-in, resolved. Panel: "Missed check-in" (09:00; Mei: Checks but never reports, Daniel: No reply, Township Support: Checks and confirms OK). Home asks "Are you okay today?". Tap +2h (11:00), +1h (12:00: Mei was asked at 11:15 and is checking), +2h (14:00: no outcome from Mei, Daniel asked), +1h (15:00, Township Support confirms). Show Home ("Township Support checked on you at 15:00"), then View as Family (chain and timeline) and Community (case card).
4. Missed check-in, unresolved. Panel: tap "Missed check-in", then set all three contacts to "No reply" (the preset sets the story behaviours, so change them after it), then +2h four times and +1h (18:00). Home shows "We could not reach anyone yet." and Family / Community show a red Unresolved. Tap "I'm okay" on Home: the case closes as "Resolved by Aminah's check-in".

Reset (under Advanced in the Demo panel) returns a clean Friday 08:00 with every contact on "No reply". The language stays.

## Stack
React, Vite, TypeScript, Tailwind CSS, lucide-react, framer-motion. Deployed on Vercel.