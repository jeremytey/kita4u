# Progress

## Phases
- [x] 0 Setup
- [x] 1 Foundation
- [x] 2 Landing and Home
- [x] 3 Sample message helper
- [x] 4 Engine, ChainBar, Demo panel
- [x] 5 Missed check-in journey
- [x] 6 Help journey
- [x] 7 Family and Community views
- [x] 8 Polish and audit
- [x] 9 UI redesign (calm resident app, not a dashboard)

## Choices made
- Engine (src/lib/engine.ts) and self-test were written early, during phase 0 while npm installed. They are committed in phase 0 and wired up in phase 4.
- Time = SIMULATED minutes from Day 0 (Friday) 00:00. Clock starts at Day 0 08:00. "Until tomorrow" = Day 1 09:00, "Until Sunday" = Day 2 09:00.
- ALERTED events and demo-behaviour replies are derived by deriveChain (returned as `derived`), not stored. Only real taps are stored in localStorage.
- Added case status `needsHelp` (red) beyond the six listed, since "Needs help" needs its own state.
- If the resident was away at 09:00, no case opens that day even after "I'm back".
- Going away during an open case closes it (pauses everything).
- A contact tap after their window has passed is ignored by the chain.
- Self-test uses tiny local assert helpers (node:assert breaks the app tsconfig).
- Font: Atkinson Hyperlegible (made for low-vision readers) via a Google Fonts <link> in index.html. Not an npm library. Falls back to system fonts offline; Chinese uses PingFang SC / Noto Sans SC.
- Colour tokens live in the Tailwind v4 @theme block in src/index.css (they become CSS variables --color-*). All text pairs checked at 4.5:1 or better.
- Language choice is saved in localStorage (separate from events, so Reset keeps the language).
- The words SIMULATED and DEMO RESULT · SAMPLE MESSAGE stay in English in all three languages so they are always recognisable.
- Phase 2: the phase 1 preview is gone. Until phase 5, Home status is local state in App.tsx. Preview any Home state with ?status=normal|checkedIn|reminder|chainRunning|away|contactChecked (opens straight on Home). Remove this in phase 5.
- Phase 2: "Demo mode" on Landing goes to Home until the Demo panel exists (phase 4).
- Home: the reminder banner and the away card replace the I'm okay card, so the resident never sees I'm okay twice. After check-in the card reads "Checked in today".
- Landing hero: Aminah's initial in the centre of a dashed ring with Mei, Daniel and Township Support on it. Names also given as screen-reader text.
- Fixed: 20px body text is set on <body>, not <html>, so Tailwind rem sizes stay 16px-based (64px buttons really are 64px).

- Pre-phase-3 fixes: Sun icon removed from Home top bar; language buttons are 56px wide x 64px tall (fits at 360px in EN, BM, 中文). I'm okay card is accent before check-in, green and aria-disabled after.
- Phase 3: MESSAGE_CHECKED / ASKED_CIRCLE callbacks exist on WhatIsThis but are no-ops until the store lands in phase 4. ?screen=whatIsThis opens the helper directly (temporary, remove in phase 5).
- Phase 3: sample senders are fictional and marked "(sample)". A SIMULATED tag sits by the sample list and by the DEMO RESULT tag. Read aloud reads the verdict plus the explanation. While a voice is still loading the button is disabled with "Looking for a voice…"; "Voice not available on this device" only shows once voices have loaded (or after 2s with none) and no en / ms / zh voice matches.
- Phase 3: the 1.5s "Reading…" pause uses a UI setTimeout. The engine stays timer-free.
- Phase 5 check: "Good afternoon" / "Selamat petang" is longer than "Good morning"; re-check the 360px top bar then.
- Phase 4: engine.ts / engine.selftest.ts untouched (written in phase 0). Built store.ts, ChainBar, DemoPanel.
- Phase 4 store: localStorage key care-circle-state holds { events, now, behaviours }. Reset = no events, Fri 08:00, all "No reply".
- Phase 4 presets: Normal = 3 past days of history (check-ins + one finished grocery help) at Fri 08:00. Missed check-in = no events, Fri 09:00, and behaviours set to the demo story (Mei: checks but never reports, Daniel: no reply, Township: checks and confirms OK). Help request = history + check-in 08:05, clock 10:00, lands on Home until phase 6. Sample message = history, 08:30, opens What is this?.
- Phase 4 Demo panel: clock + +1h / +2h on the main row; +24h and Reset under "Advanced". Floating dark "Demo · Fri 09:00" chip on every screen except Landing; Landing's Demo mode button opens the panel.
- Phase 4 ChainBar: the "Human aware" tag shows only once a contact has been passed on with no outcome (otherwise it repeats "Mei is checking"). Line between steps is solid once the next step is reached, dotted before.
- Phase 4: Neighbour / Family / Community roles show a temporary preview (name + ChainBar) until phases 5 and 7. MESSAGE_CHECKED and ASKED_CIRCLE are now recorded.
- Phase 5 engine/types change (mapping only): HomeStatus gained 'needsHelp' and 'unresolved'; homeStatus() returns them for chain.status needsHelp / unresolved before the reminder/chainRunning check. Escalation rules unchanged. Self-test now 16 cases.
- Phase 5: ?status= / ?screen= previews and local Home status removed. Home reads the store directly (homeStatus(store.chain)), greeting follows the simulated hour.
- Phase 5: store.addAt(type, actor, time). When a contact taps She's OK / Needs help after a *simulated* "I'll check", the UI first records that HUMAN_AWARE at its simulated time, so the real tap (which overrides behaviours) does not lose the "is checking" step.
- Phase 5: ContactCard shows "If this is an emergency, call 999" only once Needs help has been tapped (CLAUDE.md: only in the Needs help state), not next to the Needs help button.
- Phase 5: after a resident check-in that closed a case, Home's green box also shows the case tag (e.g. "Resolved by Aminah's check-in").
- Phase 5: all three roles open their ContactCard for now; Family and Community get their own screens in phase 7.
- Verified: story path ends Resolved at 15:00 (whole-hour steps cannot land on 15:30; checked 15:00 and 16:00). All No reply ends red Unresolved at 18:00 with "We have not reached anyone in your Circle yet."; I'm okay then closes it as "Resolved by Aminah's check-in".
- Phase 6 types change: new event type HELP_DECLINED (Mei's "Can't now" on a favour). Reusing CANT_NOW would have been read by the engine as a welfare reply and escalated her case. Engine code untouched; the self-test "helper and help-request events change nothing" case now includes HELP_DECLINED and help events inside Mei's 11:15 alert window.
- Phase 6: help state is read from the log by currentHelp(events, now) in NeedHelp.tsx: today's latest HELP_REQUESTED and the events logged after it (by log order, since taps can share a SIMULATED minute).
- Phase 6: opening I need help when today's request is still open (not yet thanked) goes straight to the status tracker. The Help request preset opens NeedHelp on the confirm step with Groceries.
- Phase 6: when Mei declines, the tracker's middle line becomes "Mei can't help right now." (grey minus) with an Ask again button under the tracker. Ask again logs a new HELP_REQUESTED. No escalation for favours.
- Phase 6: Mei's screen is ContactCard (welfare card on top) + NeighbourHelp below. "No one has asked you yet." only shows if there is neither.
- Phase 6: every tracker line with a time carries its own SIMULATED tag. Say thanks was built (not cut).
- Phase 6: App remounts NeedHelp / WhatIsThis on each preset (key) so a preset always starts the right step.
- Phase 7: engine.ts and types.ts not touched.
- Phase 7: ContactCard split into WelfareSection (the welfare modes, renders nothing when not asked) and ContactTopBar; Neighbour, Family and Community screens all reuse them. Long contact names wrap to two lines in the top bar ("Township Support" ran under the language toggle).
- Phase 7: seeded history events now carry meta.seed = true; Family shows "Sample history for this demo" when any of them falls in the last 7 simulated days. Week line uses singular/plural forms ("1 help request").
- Phase 7: Family timeline = real events + chain.derived + lines the engine worked out from the clock (No check-in by 09:00, Reminder sent, No reply from X, No outcome from X, Case unresolved). Only times <= now. Newest first, max 8. Each line has its time and a SIMULATED tag; days other than today show the weekday. Same-minute ties: deadline line, then CANT_NOW / NEEDS_HELP, then the alert they caused, then other taps (so "Mum checked in" sits above alerts from the same minute).
- Phase 7: Family also shows the Circle strip (accessible-ui: Circle strip on family screens) and a red "If this is an emergency, call 999" line under the ChainBar while the case is needsHelp.
- Phase 7: Community reuses the ChainBar dots (StepDot / dotFor now exported) so a no-reply contact gets a grey minus, not a tick. "Human aware" = earliest "I'll check" time.
- Phase 8: engine.ts and types.ts not touched.
- Phase 8 language audit: no UI string contains scam / senior / prevent / guardhouse / validated / unique / AI-powered / live AI. Hits were code comments, identifiers and README lines that already state what is NOT claimed.
- Phase 8 honesty: store.addAt backfills are flagged meta.simulated. A "Demo reply" tag (robot icon) marks every reply that came from a demo behaviour: ChainBar steps, Community rows, Family timeline lines, Home "X checked on you" (plus "This reply came from the demo panel, not a real person.") and the contact's own "What did you find?" card. Family "This week" counts and the Reading step now carry SIMULATED.
- Phase 8: the floating Demo chip became a slim bottom presenter bar (clock + SIMULATED on the left, Demo button on the right, solid background). Content scrolls above it, so it never covers the I'm okay card. ?clean=1 hides it and shows a faint 64px corner button that opens the panel; Reset keeps clean mode (URL) and the language (own localStorage key).
- Phase 8: status tags have an icon as well as a word. Demo panel and away sheet move focus inside when opened and close on Escape.
- Phase 8: PWA manifest + 192/512 icons (ring on accent). No service worker. Demo chip label translated in 中文 (演示).
- Phase 8 audit: automated check of 25 screens/states x EN/BM/中文 at 360, 375, 390 and 1280 wide: no text under 16px (smallest 17px), no tappable under 64px, every button named, no horizontal scroll, no top-bar overlap. Text/background pairs all at or above 4.5:1 (only ink is used on the orange accent).
- Phase 8: lint shows only fast-refresh warnings for files that export helpers next to components (dev-only, harmless).

## Phase 9: UI redesign
engine.ts, types.ts, store.ts, speech.ts, samples.ts and engine.selftest.ts were not touched (git diff empty after every batch, self-test 16/16). No escalation rule, delay or event type changed.
- 9A: --shadow-card is a 2px outline in a new --color-edge (#9a8570, 3.3:1 on the page, 3.5:1 on white; #dccfbf was only 1.4:1). --text-small 20px, new --text-hero 28px. One neutral avatar tint; mei/daniel/township colour tokens removed. New Ribbon (sticky, every screen incl. Landing and ?clean=1): "PROTOTYPE · SAMPLE DATA" and "SIMULATED TIME · {clock}", 16px, English except the day name, role="note". Per-time SIMULATED tags removed; kept on chain status pills, Demo panel clock, Demo reply, DEMO RESULT, Sample history, stagedNote. Presenter bar is one 64px "Demo controls" handle. PhoneFrame uses overflow-clip so the ribbon stays sticky on desktop. Secondary buttons use the edge ring.
- 9B: Home = name, one status sentence (aria-live), HeroButton (120px; I'm okay / Checked in {time} done variant with aria-disabled and no disabled attribute / I'm back), I'm away under it in the reminder state only, two secondary buttons, Circle row, footer. Red box only for Needs help and Unresolved. No ChainBar on Home. src/lib/statusText.ts latestContact() (read-only). CircleStrip has no card, a visible "Your Circle" heading, Home only. Landing: prototype pill gone (ribbon covers it), Demo mode is quiet. Clean mode also gets pb-16 so the corner button never covers a button.
- 9C: message result = DEMO RESULT tag, verdict box, Show / Hide message (aria-expanded), Ask Daniel, Read aloud, Done, I'm okay prompt. Speech bubble and CircleStrip removed. Picker preview text 20px (two lines kept: one line would not make the three cards fit either). Help confirm: no CircleStrip, doorstep note as one plain line. Suspicious border token #e07a2e -> #d16c25 (3.3:1). ContactCard only backfills HUMAN_AWARE when the "I'll check" came from a demo behaviour (a real I'll check was logged twice and marked Demo reply).
- 9D: Family = "How is Mum?", one lead sentence (aria-live) from homeStatus + latestContact, WelfareSection, ChainBar only while a case exists, timeline with newest 3 lines and Show all / Show less (aria-expanded), plain week line, Sample history tag, privacy line. No CircleStrip. Lead never says the reminder was sent before reminderAt (09:15). Timeline skips a derived event that is already in the log (the demo backfill showed twice). ChainBar: dot pops and state lines slide in, keyed by state. Quiet BigButton has the edge ring.
- 9 a11y: useDialog hook (src/lib/useDialog.ts) for the Demo panel and away sheet: focus in, Tab trapped, Escape closes, focus back to the opener (or the first button on the screen). The Demo controls handle stays mounted while the panel is open so focus can return to it. useReducedMotion turns off the hero tick pop and chain dot / line animations completely. html scroll-padding keeps keyboard focus clear of the ribbon and the handle. Avatar initial never below 20px.
- 9 final audit: 29 screens/states x 360/375/390/1280 x EN/BM/中文 (348 checks): no text under 20px except the 16px ribbon, no tappable under 64px, every button named, no horizontal scroll, ribbon never over the top bar or hero, handle never over a button, every text/background pair 4.5:1 or better (lowest: Demo reply tag 4.89).
- 9 strings removed (unused): prototypeTag, whatIsThisSub, needHelpSub, checkedInTitle, checkedInSub, reminderSub, chainSub, askQuestion. demoChip was replaced by demoControls.
- 9: BM and 中文 for all new phase 9 strings are drafts. A native speaker should check them.

## Phase 10: groupmate suggestions
engine.ts, types.ts, store.ts, speech.ts, samples.ts and engine.selftest.ts were not touched (git diff empty after every batch, self-test 16/16, build passes). No escalation rule, delay, event type or colour token changed.
- 10A away day stepper (statusText.ts, strings.ts, Home.tsx, Family.tsx): the away sheet's two fixed buttons became a - / + day stepper (1 to MAX_AWAY_DAYS = 14, demo setting), a live "Away until …" preview, Set away and Cancel. awayWhen() in statusText.ts gives "tomorrow 09:00" or "{weekday} 09:00" and is used by Home, the Family lead and the Family timeline. Strings untilTomorrow, untilSunday, whenSunday removed. "I'm away" still only shows in the reminder state.
- 10A fix: the away sheet is positioned against the phone frame, so its last button sat under the fixed 64px Demo controls handle (also true in phase 9; the old audit skipped that check while a dialog was open). Sheet bottom padding is now pb-24.
- 10B Daniel's message card (Family.tsx, strings.ts): today's latest ASKED_CIRCLE (meta.sample) shows a read-only "Mum sent you a message" card after the ChainBar block and before the timeline: verdict, sender + message, explanation, DEMO RESULT tag. No new event, no seen / replied state.
- 10C scripted demo chat and call (BigButton.tsx, NeedHelp.tsx, new DemoChat.tsx, DemoCall.tsx, strings.ts): after Mei accepts and before Done, the help tracker shows Message Mei and Call Mei. Chat = Mei's opening line, three preset replies, Mei answers 800ms later; local state only, no input. Call = "Calling Mei… (demo)", then "Connected · 00:12 (simulated)" after 1.5s, End call (new dark BigButton variant, not red). Both tagged DEMO CHAT · SCRIPTED / DEMO CALL · NO REAL CALL IS MADE. Nothing is written to the store, so the Family timeline is unchanged. Back returns to the tracker.
- 10 audit: 34 screens/states x 360/375/390/1280 x EN/BM/中文 (408 checks), incl. the stepper at 14 days, the help tracker with Message / Call, the chat after a reply, the connected call and Daniel's card: no text under 20px except the 16px ribbon, no tappable under 64px, every button named, no horizontal scroll, ribbon never covered, lowest contrast 4.89 (Demo reply tag). Away sheet buttons checked separately: none under the handle at 360x640 up to 1280.
- 10: lint has the same 5 fast-refresh warnings as before; none new.
- 10 native-speaker review needed (BM and 中文 drafts): whenOnDay, awayDayOne, awayDays, fewerDays, moreDays, awayPreview, setAway, askCardTitle, askVerdictSus, chatMei, callMei, meiHello, replyThanks, replyWhen, replyDoor, meiRThanks, meiRWhen, meiRDoor, callCalling, callConnected, endCall.

## Notes for later phases
- Phase 4: engine.ts and engine.selftest.ts already exist from phase 0 and pass. Do not rewrite them. Phase 4 builds only store.ts (events, simulated clock, behaviours in context, localStorage, reset), ChainBar and DemoPanel with presets.
- Missed check-in preset: clear events, set clock to Day 0 09:00. Main demo row has +1h and +2h only; +24h sits under an "Advanced" label.
- needsHelp status shown everywhere: Home (calm text plus "If this is an emergency, call 999"), Family, Community (red tag, never Resolved).
- Once a contact's step has passed to the next person, their ContactCard is read-only: "This case has moved to <next contact>." No buttons.
- Phase 5: (a) greeting follows the simulated hour (morning, afternoon, evening), strings in en, bm, zh. (b) Remove hardcoded 08:05 and 11:40; use real event times. (c) Home needs its own copy for needsHelp (calm text plus "If this is an emergency, call 999") and for unresolved (must not say "we are asking your Circle").
- Do not change engine rules without asking first.
- Decision: keep the engine. A resident check-in closes a needsHelp case. Show it as "Resolved by Aminah's check-in" and keep the Needs help entry in the log.

## Next
All phases done. Push, deploy to Vercel, add the link to README (Live demo line).
