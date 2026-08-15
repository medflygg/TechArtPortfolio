# ÉTHER — Storyboard refs (AI art direction)

Generated from [`ETHER_ART_DIRECTION.md`](../ETHER_ART_DIRECTION.md).

**Web pipeline (hybrid — gen images + motion):**
1. Storyboard PNGs → `public/portfolio/ether/` via `publicUrl`
2. Living plate shader (`hybridLayer.createPlateMaterial`) — Ken Burns, mouse parallax, glass warp, grain
3. Cutouts (`ether-elem-*.png`) — additive sprites with float / hover motion
4. Molecules — soft particle field
5. DOM — interaction only (notes, lab meters, DNA sliders, match hit-targets, bag)

| Chapter | Plate | Motion |
|---------|-------|--------|
| Hero | 01 → 02 blend | breath + glass enter + floaters |
| Inside | 03 | zoom + molecules + floaters |
| Anatomy | 04 | floaters react to note hover |
| Origin | 05 ↔ 06 | mix on discover |
| Lab | 07 | soft Ken Burns + DOM meters |
| DNA | 08 | breath + live sliders overlay |
| Match | 08b | breath + clickable % overlay |
| Reveal | 09 | zoom + CTA overlay |
| Dry / Bag | 10 / 11 | breath + bag form |

Elements: `ether-elem-bergamot.png`, `ether-elem-rose.png`
