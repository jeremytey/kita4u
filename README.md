# Kita4U

**Ask when you need. Be noticed when you go quiet.**

*Sime Darby Property University Hackathon 2026 · Township of Tomorrow · People track*


**Live prototype:** https://kita4u.vercel.app/ (open on a phone)
**Team:** HengOngHuat 

---

## Project description

Kita4U is a township community support platform that brings neighbours closer through CARE, CONNECT and SUPPORT. It combines daily wellbeing check-ins, trusted support circles and everyday assistance, with an automated escalation system that ensures missed check-ins are followed up until resolved. By turning neighbourly connections into meaningful action, Kita4U aims to build safer, more connected communities where no one is left unnoticed.

## The problem

> If a resident living alone goes quiet, how long until a human knows?

People can live close together in a township and still have no trusted, coordinated way to notice when someone goes quiet. A message to a family WhatsApp group does not show who is responding. An alert that is sent is not the same as help received.

## Our idea

An opt-in **trusted Circle** for a resident living alone. In the prototype, the resident is Mak Cik Aminah, and her Circle has three people in a fixed order:

1. **Mei**, a neighbour
2. **Daniel**, her son
3. **Township Support**, a *proposed* community contact (for example a township community team or guardhouse, to be agreed in a pilot)

Two jobs:

| Job | What happens |
|---|---|
| **Notice** | Aminah taps **I'm okay** once a day. If she misses it, Kita4U reminds her, then asks her Circle **one person at a time**. Every step is logged. If nobody confirms, the case shows red **Unresolved**. We never claim a human responded when none did. |
| **Ask** | Aminah can have a confusing message explained in simple words, ask Daniel, or request a small favour from Mei. Mei can also ask Aminah for a small favour, so help goes both ways. |

**999 is not a step in the chain.** Kita4U shows a Call 999 button only when someone reports "Needs help", or when a case is Unresolved (Daniel and Township views). Kita4U does not replace emergency services.

## Try it in 60 seconds

1. Open the live link on a phone.
2. Tap **Demo mode**. Home opens in a prepared story.
3. Tap the **Demo controls** pill, choose **Start a story → Missed check-in**.
4. Tap **Next step** repeatedly and watch the chain: reminder, Mei asked, Mei checking, Daniel asked, Township Support checking, outcome. Seven taps ends **Resolved**.
5. Use **View as** to see the same case from **Mei**, **Daniel** and **Township Support**.
6. Want the other ending? Run the story again, set all three contacts to **No reply**, and tap Next step until it stops. The case ends **Unresolved**, with the 999 option in Daniel's and Township's views.

> **Call 999** does not dial in the prototype. Tapping it shows a demo note; a real deployment would open the phone dialer.

The detailed script is in [docs/DEMO-SCRIPT.md](docs/DEMO-SCRIPT.md).

## What is real and what is simulated

We want you to know exactly what you are looking at.

**Works in the prototype**
- The escalation chain logic, tested by a 16-case self-test
- Daily check-in, "I'm away" mode, and closing a case by checking in
- Role views for Aminah, Mei, Daniel and Township Support, each showing different information
- Circle setup, preferences (which help types are on), and Mei's Accept / Decline invitation
- A favour request with a tracker, and a scripted parcel request from Mei
- A message explainer with three fixed sample messages
- English, Bahasa Malaysia and 中文 (BM and 中文 are drafts awaiting native review)

**Simulated or not real**
- All people, messages and times are fictional. A ribbon on every screen says `PROTOTYPE · SAMPLE DATA` and shows the simulated clock.
- Reminders, contact replies and the clock are simulated. Timings are demo settings, not validated policy. A pilot would agree timings with each Circle.
- Accept / Decline is a prototype of consent only. In a real deployment, a backend would enforce consent.
- The message explainer uses predefined sample results. No AI model is called.
- Township Support is a **proposed role**. No township, guardhouse, neighbour or family has agreed to anything.
- Demo mode starts from prepared data (Mei marked as accepted). It is not real consent.
- No login, database, push notifications, or location tracking.

**Proposed, not built**
- **Neighbourhood activities** (for example badminton or morning walks among people in your Circle). Shown as a labelled, read-only preview marked `PROPOSED FEATURE · SAMPLE CONTENT`. It stores nothing and does not work.

## Community survey

We ran a short anonymous survey on how neighbours interact, help one another and build connections in their communities. Responses are anonymous and used for research only.

| # | Question | Options |
|---|---|---|
| 1 | Which best describes you? | I live alone · I'm often home alone during the day · I live with others |
| 2 | How many of your neighbours do you know by name? | 0-1 · 2-3 · 5-6 · more than 6 |
| 3 | If you fell or felt unwell at home and couldn't call for help, how long before someone would notice? | under 1 hour · a few hours · half a day · a day or more · not sure |
| 4 | In the last year, have you (or someone you know) needed help and had nobody close by? | Yes · No |
| 5 | Would you be willing to be asked to check on a neighbour who missed their daily check-in? | Yes · No |
| 6 | What would make you more likely to say yes? (up to 2) | knowing them first · limit on how often · only certain hours · can say I'm away · being asked after family · I'd say no |
| 7 | If nobody in your circle answered, would you be comfortable with the guard house checking on you? | Yes · No · only if I agree in advance |
| 8 | Would you join a neighbourhood sports hangout (e.g. badminton, walking)? | Yes · No · Maybe |
| 9 | What worries you most about an app like this? (up to 2) | privacy · being tracked · strangers joining · burden on neighbours · false alarms · not good with phones · nothing |
| 10 | What's the biggest worry about living alone in your neighbourhood? | Open answer |

## Evidence status

- The problem has been validated by the community survey above, with 16 responses.
- Nothing in this repo is a measured result. The aim, shorter time until a human knows, has not been measured.

## How it maps to the judging criteria

| Criterion | Our answer |
|---|---|
| **Impact and sustainability** | Aim: a shorter time from "resident went quiet" to "a human knows". Not yet measured. A pilot would measure it. |
| **Innovation** | Not another alert. It records who was asked, who responded, and whether an outcome was reached. A report ("Mei reported Aminah is OK") is shown as a report, not as proof. |
| **Feasibility** | Opt-in, small groups, one township. Consent and the Township role are agreed *before* activation. The prototype is mobile web, with no special hardware. |
| **Strategic fit** | People theme: safety, neighbourhood connection, accessibility. Built around a township's existing community layer. |
| **Commercial and value multiplication** | A possible township-sponsored service, subject to an agreed operating model. Not costed in this prototype. |
| **Team, evidence and pitch** | Honest status above. Interview findings will be added only once we have them. |

## Proposed pilot (not done)

- **Scope:** a small group of consenting households in one township, about three months.
- **Measures (no targets set):** time from missed check-in to the first person acknowledging, time to a recorded outcome, number of Unresolved cases, false alerts.
- **Before activation:** agree the Township Support role, its hours, and who operates it.

## Known limits and risks

- Not tested on a real phone, with 150% system text, or with a screen reader.
- Narrow screens (about 260px wide) have a known layout problem on Home.
- A Circle needs people. Residents with no neighbour or family need a different pathway.
- Someone must operate the Township role. Sime Darby Property may not want to be a welfare response provider.
- Why not just a WhatsApp reminder? Kita4U adds a third, agreed contact and a logged record of who was asked and who confirmed. This is unvalidated until interviews exist.

## Roadmap (all proposed)

1. **Pilot:** validate how Circles behave and agree a township operating model.
2. **Expand:** neighbourhood activities among people in your Circle; more flexible Circles.
3. **Scale:** alternative check-in methods (family-assisted, WhatsApp or phone call, a physical button), an "unable to verify" outcome for neighbours, accessibility options, other townships.

## Built with

React 19, Vite, TypeScript, Tailwind CSS v4, lucide-react, framer-motion. Hosted on Vercel. State lives in the browser's localStorage.

```
npm install
npm run dev        # run locally
npm run build      # production build
npx tsx src/lib/engine.selftest.ts   # engine tests (16)
```

Add `?clean=1` to the URL for a recording without the presenter pills.

## Design rules we follow

Text is 20px or more. Every tap target is 64px or more (presenter pills 56px). Red is used only for Unresolved, Needs help and Call 999. Every state has an icon and a word, not colour alone. See [docs/PITCH-CLAIMS.md](docs/PITCH-CLAIMS.md) for what we may and may not say about the prototype.