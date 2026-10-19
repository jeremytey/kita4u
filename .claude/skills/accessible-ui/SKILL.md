---
name: accessible-ui
description: Rules for building large, calm, accessible mobile screens for residents living alone, including older adults and people with disabilities. Use whenever creating or changing any UI in this project.
---
# Accessible UI rules
## Size and touch
- Phone width, max 430px, one column, 16px side padding.
- Body and small text 20px minimum. Only the top ribbon may be 16px. Never 13 to 18px text. Eyebrows (small labels above a heading) are 20px bold upper case. Card titles 24px bold. Greeting 30px. Hero label 28px bold.
- Every tappable thing is 64px tall or more, with 12px gap between buttons. Only the floating Demo controls pill (presenter tool) may be 56px. The Home check-in card has no fixed minimum height (the Circle ring makes it tall) and holds an 82px dark I'm okay button right under its heading.
- The language toggle stays three 56x64 buttons. Back stays a labelled pill (arrow + word). On narrow phones tighten gaps and padding first; if they still do not fit, the toggle wraps to its own row. Never shrink a tap target.
- Action cards: one action per card, full width, one column. Icon tile, title, at most one short line of subtext, a chevron. 2px edge border so the card reads as a button. No badges or extra buttons on a card.
- Maximum 3 main actions on any resident screen. Full-width buttons, stacked vertically. Home's three are I'm okay, Ask your Circle and Help your Circle, plus one dashed grey "proposed preview" link under them (Neighbourhood activities (proposed)) that is not a main action: grey, dashed, never green or red, 64px or taller.
- Every sub-screen has one large Back button, top left. No bottom navigation.
## Colour and state
- Text contrast 4.5:1 or better. Never use colour alone: every state has an icon and a word.
- Red only for Unresolved and Needs help. Primary actions use the soft warm accent.
- Call 999 is the one tel: link and the one red button outside Unresolved/Needs help states. (It appears only inside those states, never anywhere else.)
- Green = done. Amber = waiting. Grey = no reply, paused or not needed. Orange box = suspicious.
## Icons
- lucide-react only. Dark glyph inside a tinted 56px rounded square. No emoji in the UI.
## Layout
- Cards: 24px radius, a 2px border (--color-edge, 3:1 on the page) instead of a soft shadow, white on warm off-white. 16px between cards, 24px between groups.
- The Circle ring (src/components/CircleRing.tsx: Aminah in the centre, Mei, Daniel and Township Support on a dashed ring) is on Landing and inside the Home check-in card (numbered 1/2/3, tone matching the card). The old Circle strip card is no longer rendered.
- Avatars are three flat illustrated badges (Mei, Daniel, Township Support) from src/components/avatars.tsx: one shared spec, flat fills, no gradients. Each is named "Name, Role" for screen readers and always sits near the visible name. Daniel's badge is a muted sage, not the done-green.
- Icon tiles are slightly tilted with a small highlight dot; decorative only. Never use the Sparkles icon (it implies live AI).
- No chain bar on resident screens. The resident gets one status sentence; the chain bar is for Family and Community.
## Copy
- Short sentences, everyday words, one idea per line. Warm, not medical.
- Say "looks suspicious", never "scam". Say "Mei checked on you", never "monitoring".
## Demo tools
- The Demo controls pill floats bottom-right inside the phone column. Screens keep 96px of bottom padding so it never covers the last button. Sheets and the Demo panel cover it.

## Motion
- 200ms fades and slides. A tick pops on success. Chain dots fade in one by one.
- Respect prefers-reduced-motion. No bounce, no parallax, no autoplay audio.
## Language
- Toggle EN / BM / 中文 in the top bar. All strings come from src/strings.ts.
