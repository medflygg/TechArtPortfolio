# ÉTHER — Art Direction Lock

**Visual language:** Dark Luxury × Sci-Fi Biology × Editorial Perfume

Not a luxury perfume shop. Somewhere between:

- luxury perfume campaign
- scientific laboratory
- cosmic interface
- microscopic world
- cinematic CGI

**Core rule:** Do not make everything photoreal. Some objects feel physically real; some feel nearly impossible — one universe.

**Workflow (intent, not a tech mandate):** Art Direction → concept/assets → motion prototype → WebGL → production. AI as art director / concept artist; real 3D + shaders for interaction. Stack choices may change; this visual lock does not.

---

## Layers

| Layer | Role |
|-------|------|
| **A — Real 3D** | Bottle, globe, lab, organics, glass, abstract structures |
| **B — Shaders** | Liquid, smoke, glass, hologram, refraction, iridescence, particles |
| **C — 2D** | Textures, labels, editorial imagery, maps, type, backgrounds |

Do not generate the whole interactive 3D world with AI. AI: moodboards, textures, exploration. Interaction needs authored assets + shaders.

---

## Hero asset — one bottle

One ideal bottle, reused across Hero → Inside → Anatomy → Product → Checkout:

- transparent glass
- liquid (recolorable)
- separate cap
- metal details
- quiet typography / swappable label
- disassemblable parts

---

## Ingredient language (not stock photos)

| Note | Form |
|------|------|
| **Bergamot** | Translucent citrus sphere; glowing microcapsules inside |
| **Rose** | Near-black flower; translucent petals |
| **Oud** | Dark wood structure; smoke rising |
| **Vanilla** | Golden crystals / dust |
| **Iris** | Blue–violet organic structure |

Ingredients must read as one universe.

---

## Narrative frames (storyboard spine)

1. Hero — bottle + *YOU DON'T SEE A SCENT.*
2. Dolly in — glass fills frame
3. Inside — vast particles
4. Top — Bergamot / Pink Pepper
5. Heart — Rose / Iris
6. Base — Oud / Vanilla
7. Exit bottle
8. Dark Earth
9. Origin (e.g. Madagascar)
10. Ingredient stream → bottle
11. Lab → DNA → Match → Reveal → Dry-down → Bag

Motion prototype should prove the story before heavier WebGL polish.

---

## Signature moments

### Globe
Black Earth, thin atmosphere, continents barely visible. Only origin sites glow. Routes = living particle streams, not flat SVG. Selecting an origin flies the camera along the route into the bottle.

### Liquid
Custom liquid behavior (motion, response to rotation). Transition: liquid stretches → particles. Prefer volume/noise feel over a flat transparent cylinder.

### Scent / smoke
GPU particles + noise field (not video). Dust, petals, molecules, aromatic streams. Cursor stirs the scent field.

### Scent Memory (future)
End journey: personal constellation of places + notes explored — *This is your olfactory profile.*

---

## Typography

- **Display:** elegant serif (editorial) — calm, large; visual does the shouting
- **UI:** tiny grotesk — Swiss / Geist / Suisse-style

Editorial × technology.

---

## Color

Base (not rainbow):

| Token | Hex |
|-------|-----|
| Void | `#050505` |
| Surface | `#111111` |
| Bone | `#EAE6DD` |

One accent per fragrance:

| Scent | Accent |
|-------|--------|
| NOCTURNE | `#6B4EFF` |
| EMBER | `#C68132` |
| MIST | `#8BB8C9` |

Whole site states shift with the active scent accent.

---

## Material library (target)

- **Glass:** bottle, frosted, crystal
- **Liquid:** transparent / dark / golden
- **Organic:** petals, wood, fruit, crystals
- **Atmosphere:** smoke, fog, dust, particles

---

## Playbook constraints (still apply)

- Brand-first ÉTHER on Hero
- Thumb: frozen Hero, no continuous WebGL
- One GPU layer; purposeful motion
- Host ATLAS accent must not bleed into the living root
