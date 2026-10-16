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
- [ ] 8 Polish and audit

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

## Notes for later phases
- Phase 4: engine.ts and engine.selftest.ts already exist from phase 0 and pass. Do not rewrite them. Phase 4 builds only store.ts (events, simulated clock, behaviours in context, localStorage, reset), ChainBar and DemoPanel with presets.
- Missed check-in preset: clear events, set clock to Day 0 09:00. Main demo row has +1h and +2h only; +24h sits under an "Advanced" label.
- needsHelp status shown everywhere: Home (calm text plus "If this is an emergency, call 999"), Family, Community (red tag, never Resolved).
- Once a contact's step has passed to the next person, their ContactCard is read-only: "This case has moved to <next contact>." No buttons.
- Phase 5: (a) greeting follows the simulated hour (morning, afternoon, evening), strings in en, bm, zh. (b) Remove hardcoded 08:05 and 11:40; use real event times. (c) Home needs its own copy for needsHelp (calm text plus "If this is an emergency, call 999") and for unresolved (must not say "we are asking your Circle").
- Do not change engine rules without asking first.
- Decision: keep the engine. A resident check-in closes a needsHelp case. Show it as "Resolved by Aminah's check-in" and keep the Needs help entry in the log.

## Next
Phase 8: polish and audit.
