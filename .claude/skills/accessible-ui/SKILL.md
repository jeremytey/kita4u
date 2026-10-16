---
name: accessible-ui
description: Rules for building large, calm, accessible mobile screens for residents living alone, including older adults and people with disabilities. Use whenever creating or changing any UI in this project.
---
# Accessible UI rules
## Size and touch
- Phone width, max 430px, one column, 16px side padding.
- Body text 20px minimum. Card titles 24px bold. Greeting 30px. Nothing below 16px.
- Every tappable thing is 64px tall or more, with 12px gap between buttons.
- One action per card: an icon, a title, at most one short line of subtext. No badges, arrows or extra buttons on a card.
- Maximum 3 main actions on any resident screen. Full-width buttons, stacked vertically.
- Every sub-screen has one large Back button, top left. No bottom navigation.
## Colour and state
- Text contrast 4.5:1 or better. Never use colour alone: every state has an icon and a word.
- Red only for Unresolved and Needs help. Primary actions use the soft warm accent.
- Green = done. Amber = waiting. Grey = no reply, paused or not needed. Orange box = suspicious.
## Icons
- lucide-react only. Dark glyph inside a tinted 56px rounded square. No emoji in the UI.
## Layout
- Cards: 24px radius, soft shadow, white on warm off-white. 16px between cards, 24px between groups.
- The Circle strip (3 round initial circles with role labels) is always visible on Home and appears on help confirm, result, family and chain screens.
## Copy
- Short sentences, everyday words, one idea per line. Warm, not medical.
- Say "looks suspicious", never "scam". Say "Mei checked on you", never "monitoring".
## Motion
- 200ms fades and slides. A tick pops on success. Chain dots fade in one by one.
- Respect prefers-reduced-motion. No bounce, no parallax, no autoplay audio.
## Language
- Toggle EN / BM / 中文 in the top bar. All strings come from src/strings.ts.
