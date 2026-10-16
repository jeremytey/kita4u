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

## Run locally
npm install
npm run dev

## Try the demo
1. Open the app and tap "Demo mode".
2. Use the Demo panel to set the simulated clock and each contact's behaviour.
3. Switch roles (Resident, Neighbour, Family, Community) to see each view.

## Stack
React, Vite, TypeScript, Tailwind CSS, lucide-react, framer-motion. Deployed on Vercel.