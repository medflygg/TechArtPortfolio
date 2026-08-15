# ÉTHER — Bottle 3D Asset Brief

**Status:** on hold in site (`hidden`), asset pipeline active  
**Priority:** #1 hero model (reuse Hero → Match ×3 → Reveal → Bag)  
**Reference photo:** [`ether-bottle-ref.png`](./ether-bottle-ref.png) · also `public/portfolio/ether/ether-bottle-ref.png`  
**Storyboard lock:** `public/portfolio/ether/ether-01-hero.png`, `ether-09-product-reveal.png`, `ether-08b-match.png`

---

## Goal

One production glass bottle for WebGL (glTF). Looks like editorial perfume CGI, not a greybox. Liquid recolors per SKU; label name swaps.

## Visual lock

| Spec | Value |
|------|--------|
| Silhouette | Tall **rectangular** flacon, sharp edges, thick base |
| Cap | Polished chrome / silver cylinder |
| Liquid (NOCTURNE ref) | Vivid violet `#6B4EFF` |
| Label | Dark square, quiet type: ÉTHER / SKU / EXTRAIT DE PARFUM / 100ML |
| Ground | Optional dark wet reflection (in shot only; not required in GLB) |
| Background | Void `#050505` — **no botanicals** on the clean ref |
| Palette | Void `#050505` · Surface `#111111` · Bone `#EAE6DD` |

**SKU accents (liquid):** NOCTURNE `#6B4EFF` · EMBER `#C68132` · MIST `#8BB8C9`

## Deliverable

| File | `ether-bottle.glb` |
|------|-------------------|
| Height | ~1.0 unit body (+ cap) |
| Tris | 5–15k |
| Pivot | Center of bottle base (sits on y=0) |
| Scale | Real-world-ish proportions; tall, not squat |

### Node names (exact)

```
Bottle
├── Body          # glass
├── Liquid        # separate volume, slightly inset
├── Neck          # optional, glass
├── Collar        # metal ring
├── Cap           # metal group
│   ├── CapBody
│   └── CapTop
└── Label         # plane or thin mesh, +Z front
```

### Materials

| Name | Notes |
|------|--------|
| `Glass` | Clear, IOR ~1.45–1.5, roughness low, transmission |
| `Liquid` | Opaque/translucent volume; color driven in engine |
| `Metal` | Chrome, high metalness |
| `Label` | Base color / alpha; UVs for swap texture |

### Engine hooks

- Liquid mesh must be **recolorable** (vertex color or plain baseColor).
- Cap separable (visibility toggle on Reveal).
- Label UVs 0–1 square for canvas/texture swap (`NOCTURNE` / `EMBER` / `MIST`).

---

## Image-gen prompt (clean product ref)

Use for Midjourney / Flux / SD — **solo bottle, no props**:

```
Luxury perfume product photography, single rectangular glass perfume bottle,
sharp-edged tall flacon, thick glass base, filled with vivid deep violet liquid,
polished cylindrical chrome silver cap, minimal dark square label with elegant
serif typography reading ÉTHER and NOCTURNE and EXTRAIT DE PARFUM,
centered on dark wet reflective black surface, void black background #050505,
dramatic editorial studio lighting, soft violet rim light, high-end fragrance
campaign CGI, photoreal, 3/4 front view, full bottle visible base to cap,
Dark Luxury aesthetic, no flowers, no botanicals, no smoke, no extra objects,
no watermark, no logo outside label
```

### Negative

```
round bottle, squat bottle, spray cloud, flowers, rose, citrus, people,
hands, text overlay, UI, watermark, busy background, neon cyberpunk city,
plastic toy look, low-poly, blurry label
```

### Variants (same prompt + suffix)

- `-- EMBER amber liquid #C68132 warm rim light`
- `-- MIST icy blue liquid #8BB8C9 cool rim light`
- `-- orthographic front elevation, technical turntable lighting` (for modeling)

---

## Modeling prompt (Blender / contractor)

```
Model a luxury rectangular perfume bottle matching the reference photo
ether-bottle-ref.png. Sharp box body with slight edge bevel, cylindrical
chrome cap, inset liquid volume, front label plane. Export glTF 2.0 with
named nodes Body, Liquid, Cap, Collar, Label. PBR materials Glass, Liquid,
Metal, Label. Pivot at base center. Keep under 15k triangles. No environment
mesh in the file.
```

---

## Acceptance checklist

- [ ] Reads as same bottle as `ether-bottle-ref.png` / hero storyboard  
- [ ] Glass + liquid readable at portfolio thumb size  
- [ ] Liquid recolor NOCTURNE / EMBER / MIST without remesh  
- [ ] Cap hide/show works  
- [ ] Label texture swap works  
- [ ] Loads in Three.js / glTF viewer without missing maps  

## Out of scope (later)

Botanicals, flask, vials, globe — separate briefs after bottle lands.
