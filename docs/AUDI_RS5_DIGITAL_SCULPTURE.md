# Audi RS 5 Sportback — Digital Sculpture

Production brief for the ATLAS living case.

**Status:** visual direction approved; six key screens established in Figma  
**Product:** Audi RS 5 Sportback, revised B9.5 generation  
**Experience type:** interactive digital showroom + 3D configurator + portfolio case  
**Figma:** [Audi RS5 Sportback — visual direction and expanded UX](https://www.figma.com/design/gKYESaUQSQgRgQLZUqafOd)

---

## 1. Project goal

Build a premium living site in which the car is both the central visual and the main interface.

The experience should:

- present the RS 5 Sportback as a digital sculpture, not as a conventional product catalogue;
- allow exterior and cabin configuration on a real-time 3D model;
- explain performance systems through spatial infographics integrated into the scene;
- distinguish official Audi data from conceptual simulations;
- work as a polished portfolio case in both `full` and static `thumb` modes;
- remain fast enough for a browser and understandable without instructions.

The first viewport must remain one composition. The car dominates; UI and VFX only explain its form, materials, and engineering.

---

## 2. Factual foundation

Official figures for the revised RS 5 Sportback:

- 2.9 TFSI V6 biturbo;
- 331 kW / 450 PS;
- 600 Nm from 1,900 to 5,000 rpm;
- 0–100 km/h in 3.9 seconds;
- 0–200 km/h in 13.7 seconds;
- 250 km/h standard top speed;
- 280 km/h with the RS dynamic package;
- eight-speed tiptronic;
- permanent quattro all-wheel drive;
- default torque distribution: 40% front / 60% rear;
- possible redistribution: up to 70% front or 85% rear;
- optional sport differential on the rear axle;
- optional RS sport suspension plus with hydraulic Dynamic Ride Control;
- 10.1-inch MMI touch display and optional Audi virtual cockpit plus;
- optional carbon-ceramic front brakes with 400 mm discs;
- Sportback dimensions: 4,783 × 1,866 × 1,387 mm;
- wheelbase: 2,826 mm;
- luggage compartment: 465 l.

Official values should be presented as facts. Any invented package, score, or performance delta must be marked `Concept simulation` and must not look like an Audi claim.

### Option-to-data rules

- **RS dynamic package:** may change displayed top speed from 250 to 280 km/h. This is official.
- **Sport differential:** may change the torque-flow visualization and corner-exit behavior, but not invent a faster lap time.
- **Dynamic Ride Control:** may change roll/pitch visualization and damper mode, but not invent numerical handling gains.
- **Carbon-ceramic brakes:** may visualize thermal resistance and reduced fade. Do not state an exact stopping distance without a source.
- **RS sport exhaust:** may change the sound profile and exhaust visualization. Do not state a power increase.
- **Wheels and styling packages:** visual changes only unless a verified technical effect is available.

---

## 3. Experience structure

Only screens with a distinct interaction or visual role are required.

### 01 — Hero / Material Reveal

Purpose:

- establish the Digital Sculpture direction;
- introduce the car through light rather than a conventional photo;
- offer one primary action: `Explore RS 5`.

Techniques:

- front three-quarter camera;
- champagne key light and cool rim light;
- contact shadow and very subtle floor reflection;
- controlled light sweep revealing the Singleframe, shoulder line, and wheel arches;
- no floating cards or specification grid.

### 02 — Exterior Configurator

Purpose:

- select paint, wheels, brake calipers, lighting, and styling package;
- rotate the model within a constrained showroom camera;
- keep the selected material physically plausible.

Techniques:

- material swatches instead of product cards;
- hotspots attached to actual meshes;
- camera presets for front, side, rear, and detail;
- progressive material transitions rather than instant color replacement;
- one contextual control group visible at a time.

### 03 — Distance Strip (0–100)

Purpose:

- turn the official 0–100 km/h figure into a measured path — distance moves, the car does not.

Techniques:

- side silhouette camera; car stays planted;
- dimension strip on the asphalt (~54 m official path, scaled for framing);
- Launch drives a marker along the strip;
- instrument readout: meters · seconds · km/h.

### 04 — quattro Flow

Purpose:

- explain permanent all-wheel drive without a flat chart.

Techniques:

- elevated top-view vehicle;
- torque represented as light moving through the drivetrain;
- default 40:60 distribution;
- selectable 70:30 and 15:85 limit states;
- optional sport differential appears as an additional rear-axle layer.

### 05 — Load Lab

Purpose:

- explain DRC and sport differential through corner load, not dramatic body lean.

Techniques:

- planted car with only a tiny visual roll cue;
- four-corner load bars respond to damper / DRC / sport differential;
- DRC equalizes diagonal pressures; open dampers show free diagonal transfer;
- sport differential biases outer rear torque in the load readout;
- comfort / auto / dynamic damper states change how even the corner loads stay.

### 06 — Cabin Configurator

Purpose:

- move from exterior sculpture to driver-focused interior configuration.

Techniques:

- separate interior camera rail;
- material hotspots for steering wheel, seats, stitching, and inlays;
- fine Nappa leather and RS design package variants;
- contextual RS Monitor with temperature, boost, g-force, and tire data;
- no attempt to turn the screen into a full infotainment simulator.

Text chapters, a conventional gallery, and a separate specification summary are secondary. They should be built only if the six primary scenes do not provide enough context.

---

## 4. Visual language

### Core palette

- void: `#090909`;
- elevated surface: `#151514`;
- warm white: `#EEE7DD`;
- champagne metal: `#D7B98F`;
- graphite: `#3F3A34`;
- RS red: `#E14A5D`;
- technical cool accent: `#75A7AE`.

RS red is reserved for:

- rear lights;
- active performance state;
- selected RS option;
- launch pulse;
- warnings or hot telemetry.

Do not use red as a generic decoration.

### Typography

- restrained geometric grotesk;
- large, light-weight display figures;
- compact uppercase technical labels;
- no more than one major statement per scene;
- data labels stay secondary to the vehicle.

Current Figma direction uses Manrope. Production may use a metrically compatible web font if licensing or loading requires it.

### Composition

- vehicle occupies roughly 70–75% of the meaningful visual field;
- asymmetry is preferred over a centered dashboard;
- controls collect at the edge or bottom of the screen;
- the scene remains readable with UI hidden;
- cards are used only for interaction, never as hero decoration.

---

## 5. Material Data Sculpture techniques

The infographic should exist in the same spatial world as the car.

### Data as geometry

- torque becomes luminous rails;
- elapsed time becomes distance and ghost positions;
- DRC becomes a visible cross-linked hydraulic structure;
- body movement becomes two superimposed poses;
- braking heat becomes a material temperature gradient;
- active option states alter the scene rather than only updating text.

### Camera rails

Use authored camera transitions instead of unrestricted orbiting:

- hero three-quarter;
- side silhouette;
- top drivetrain;
- wheel/brake detail;
- driver cockpit;
- rear-seat/material detail.

Limited orbit is available in configurator scenes only. Story scenes use fixed camera rails so composition and typography remain controlled.

### Light and atmosphere

- warm key plus cool rim;
- restrained volumetric haze;
- contact shadow under the vehicle;
- subtle reflection, preferably baked or approximated;
- localized bloom on torque paths and lamps only;
- no global glow soup;
- no decorative particles unless they communicate speed, airflow, or heat.

### Motion

- UI transitions: 150–220 ms;
- material transition: 350–600 ms;
- camera transition: 700–1,200 ms;
- chapter transition: 800–1,400 ms;
- acceleration sequence: exactly 3.9 seconds;
- no automatic carousel and no looping hero choreography after the first reveal.

Every animation must explain a state change, a material property, or a technical system.

---

## 6. Audio direction

Audio is recommended, but it must be optional and event-driven.

### Experience rule

The site starts muted. A visible `Sound on` action unlocks audio after a user gesture. The choice persists for the session and a mute control remains available on every scene.

Never attempt audible autoplay.

### Audio layers

#### A — Showroom ambience

- very quiet low-frequency room tone;
- subtle air and distant mechanical resonance;
- seamless 20–40 second loop;
- no melody competing with the visual;
- fades between chapters instead of restarting.

#### B — Interface one-shots

- soft metal or glass clicks;
- material swatch confirmation;
- restrained camera-lock sound;
- RS mode activation;
- no generic sci-fi beeps.

#### C — Vehicle moments

- ignition or wake-up sound on explicit interaction;
- exhaust character change when RS sport exhaust is selected;
- one authored 0–100 launch sequence;
- brief downshift or turbo transient for performance transitions;
- no continuous fake engine loop while the user merely rotates the model.

#### D — Spatial technical cues

- torque flow pans from center to front/rear axle;
- DRC links use paired diagonal cues;
- cabin ambience becomes drier and more enclosed;
- camera movement can slightly alter stereo position, but should not become a headphone demo.

### Mix and implementation

- native Web Audio API is sufficient; no audio dependency is required initially;
- use a single `AudioDirector` with named scene events;
- crossfade ambience over 300–600 ms;
- keep ambience around `-22` to `-18 LUFS` and UI/vehicle peaks below approximately `-6 dBFS`;
- provide compressed Opus where supported and MP3/AAC fallback;
- load ambience after consent and preload only the next likely one-shot;
- suspend audio when the tab is hidden;
- `thumb` mode is always silent;
- audio failure must never block navigation or 3D interaction.

Suggested event map:

```text
enter → audio unlock prompt
hero.reveal → light sweep + restrained wake-up
paint.change → material confirmation
camera.lock → soft mechanical lock
launch.start → authored 3.9 s sequence
quattro.front/rear → spatial torque cue
drc.toggle → hydraulic pressure cue
exhaust.toggle → A/B exhaust sample
cabin.enter → enclosed ambience crossfade
mute → immediate gain ramp to zero
```

### Rights

Do not extract and reuse engine audio from Audi videos unless the license explicitly permits it.

Preferred sources:

- licensed commercial sound libraries;
- original field recordings;
- commissioned or synthesized UI sounds;
- temporary placeholders clearly marked for replacement.

---

## 7. 3D model

Current prototype candidate:

[2021 Audi RS5 Sportback by Ddiaz Design — Sketchfab](https://sketchfab.com/3d-models/2021-audi-rs5-sportback-75088a5f8c2940fc8baac4ad98bec713)

Local working file:

`public/portfolio/audi-rs5/rs5.glb`

Current listing data:

- 523.8k triangles;
- 293.6k vertices;
- downloadable;
- license: `CC Attribution-NonCommercial-ShareAlike`;
- based on an Audi model with additional credits listed by the author.

### License warning

This model is acceptable only for a non-commercial portfolio use that complies with attribution and ShareAlike requirements. It is not suitable for a commercial Audi/client release without separate permission.

Before publishing:

1. preserve the author and upstream credits;
2. confirm that the download still includes a clear license record;
3. include attribution in the case footer or credits;
4. do not remove license information from the optimized derivative;
5. replace the model if the project becomes commercial.

The model is labeled 2021 while the primary Audi source covers the 2020 revised generation. The exterior and interior details must be compared before production.

### Required optimization

Target:

- approximately 180k–250k visible triangles for desktop;
- lower LOD for weak GPUs and mobile;
- 2K exterior textures, with 1K variants where detail allows;
- KTX2/Basis texture compression;
- Meshopt or Draco geometry compression;
- one environment map reused across scenes;
- lazy-load cabin geometry only when entering the interior;
- dispose unused geometries, materials, render targets, and audio buffers.

Separate or author meshes for:

- body paint;
- glass;
- front and rear lamps;
- wheels;
- brake discs;
- calipers;
- gloss-black, aluminum, and carbon trim;
- seats;
- stitching;
- dashboard/inlays;
- steering wheel;
- exhaust tips.

If the source model does not contain a usable interior, the cabin scene should use a separate optimized interior asset rather than pretending the exterior shell includes production-ready cabin geometry.

---

## 8. Technical approach

Recommended stack within the current portfolio:

- React + TypeScript;
- Three.js;
- `GLTFLoader`;
- constrained camera controls;
- authored scene state machine;
- CSS UI over the WebGL canvas;
- native Web Audio API;
- Vite asset paths through `publicUrl()`.

Suggested module split:

```text
src/pages/web/living/audi-rs5/
  AudiRs5Site.tsx
  AudiRs5Scene.tsx
  AudiRs5Configurator.tsx
  AudiRs5Audio.ts
  audiRs5Data.ts
  audiRs5Materials.ts
  audiRs5Cameras.ts
  audiRs5Types.ts
```

Primary state:

```text
chapter
cameraPreset
paint
wheel
caliper
exteriorPackage
interiorMaterial
stitching
options
audioEnabled
qualityTier
```

The 3D scene consumes state; it must not own product data or UI copy.

---

## 9. Work plan

### Phase 0 — Rights and source lock

- download and archive the Sketchfab license;
- confirm model credits and non-commercial use;
- collect approved Audi photos/video references;
- define which media can be embedded and which must be recreated;
- lock official data and label conceptual values.

**Exit:** all production assets have a known source and usage status.

### Phase 1 — 3D feasibility prototype

- inspect model topology, UVs, materials, and interior;
- split configurable meshes;
- produce desktop and reduced LODs;
- test KTX2 and geometry compression;
- verify load time and memory on target devices;
- create hero and configurator camera presets.

**Exit:** optimized GLB renders correctly and paint changes do not affect glass, lights, or trim.

### Phase 2 — Living shell

- add the Audi case to `webCases`;
- implement `full` and `thumb` modes;
- register the living site;
- create static 16:9 hero fallback for cards;
- establish local Audi tokens without ATLAS accent bleed.

**Exit:** the case opens from the portfolio and the thumb does not run continuous WebGL.

### Phase 3 — Hero and exterior configurator

- implement material reveal;
- add constrained camera controls;
- wire paint, wheels, calipers, and styling packages;
- create accessible labels and keyboard controls;
- persist the current configuration.

**Exit:** the primary product interaction works without VFX or audio.

### Phase 4 — Material Data Sculpture

- build acceleration sequence;
- build quattro flow;
- build DRC ghost body and hydraulic links;
- build sport differential vectoring state;
- connect official option logic to visual changes.

**Exit:** each technical system is understandable without reading a specification table.

### Phase 5 — Cabin

- load interior geometry on demand;
- add camera presets and material hotspots;
- implement upholstery, stitching, and inlay options;
- create the contextual RS Monitor.

**Exit:** exterior-to-interior transition is stable and does not duplicate the exterior UI.

### Phase 6 — Audio

- create temporary event map and placeholder sounds;
- implement user-consent unlock and persistent mute;
- synchronize launch and technical cues;
- replace placeholders with licensed final assets;
- test without audio and with slow loading.

**Exit:** audio improves state recognition but the experience remains complete when muted.

### Phase 7 — Optimization and QA

- adaptive pixel ratio and quality tiers;
- reduced-motion behavior;
- WebGL and static fallback;
- keyboard and screen-reader support for all controls;
- pause rendering and audio when hidden;
- mobile thermal and memory test;
- verify no unsupported Audi performance claims.

**Exit:** stable frame time, bounded memory use, and no interaction depends solely on sound or animation.

### Phase 8 — Portfolio case

- document problem, art direction, UX logic, 3D pipeline, and optimization;
- show Figma-to-production comparison;
- include official sources and 3D/audio credits;
- capture static images and short video;
- publish the living demo and case narrative.

---

## 10. Definition of done

- six distinct scenes implemented;
- car remains the dominant visual in every scene;
- exterior and interior options change real 3D materials;
- official figures are sourced and conceptual data is labeled;
- acceleration, quattro, and DRC are spatial rather than flat infographics;
- sound is optional, licensed, and user-initiated;
- desktop experience has stable performance;
- weak-device fallback is usable;
- portfolio thumb is static and silent;
- all Audi, model, media, and audio credits are visible.

---

## 11. Sources

- [Audi RS 5 Sportback overview](https://www.audi.com/en/audi-rs-5-sportback-until-2024-9942)
- [Audi RS 5 Coupé and Sportback press information](https://www.audi.com/en/the-sporty-spearhead-of-the-product-line-with-a-new-look-the-rs-5-coupe-and-rs-5-sportback-2020-12728)
- [Audi facts and figures](https://www.audi.com/en/the-sporty-spearhead-of-the-product-line-with-a-new-look-the-rs-5-coupe-and-rs-5-sportback-2020-12728/facts-and-figures-12733)
- [Audi exterior design](https://www.audi.com/en/the-sporty-spearhead-of-the-product-line-with-a-new-look-the-rs-5-coupe-and-rs-5-sportback-2020-12728/exterior-design-12729)
- [Audi interior, operating concept, drive, and suspension](https://www.audi.com/en/the-sporty-spearhead-of-the-product-line-with-a-new-look-the-rs-5-coupe-and-rs-5-sportback-2020-12728/interior-and-operating-concept-12730)
- [Sketchfab model](https://sketchfab.com/3d-models/2021-audi-rs5-sportback-75088a5f8c2940fc8baac4ad98bec713)
