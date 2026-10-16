# Progress

## Phases
- [x] 0 Setup
- [ ] 1 Foundation
- [ ] 2 Landing and Home
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
