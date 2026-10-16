# Progress

## Phases
- [x] 0 Setup
- [x] 1 Foundation
- [x] 2 Landing and Home
- [ ] 3 Sample message helper
- [ ] 4 Engine, ChainBar, Demo panel
- [ ] 5 Missed check-in journey
- [ ] 6 Help journey
- [ ] 7 Family and Community views
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

## Notes for later phases (from Jeremy)
- Phase 4: engine.ts and engine.selftest.ts already exist from phase 0 and pass. Do not rewrite them. Phase 4 builds only store.ts (events, simulated clock, behaviours in context, localStorage, reset), ChainBar and DemoPanel with presets.
- Missed check-in preset: clear events, set clock to Day 0 09:00. Main demo row has +1h and +2h only; +24h sits under an "Advanced" label.
- needsHelp status shown everywhere: Home (calm text plus "If this is an emergency, call 999"), Family, Community (red tag, never Resolved).
- Once a contact's step has passed to the next person, their ContactCard is read-only: "This case has moved to <next contact>." No buttons.
- Do not change engine rules without asking first.
- Decision: keep the engine. A resident check-in closes a needsHelp case. Show it as "Resolved by Aminah's check-in" and keep the Needs help entry in the log.

## Next
Phase 3: Sample message helper.
