# Fidget Toy Web App — Mini PRD

## What it is
A satisfying keycap clicker web app. Built as a web app, added to iPhone home screen or installed as a desktop app (no App Store).

## Who it's for
Just you, initially. No accounts, no backend, no data storage.

## Core toy

### Keyboard Clicker — validated ✓
- 2 plain keycap buttons, no letters
- Press: fast ease-in scale/translateY down, shadow compresses
- Release: springy ease-out bounce back, glow pulse
- Real recorded keystroke audio (trimmed from a keyboard sample) plays on press, pooled so rapid clicks don't cut each other off
- Streak counter on rapid clicks
- Status: feel and sound both landed — this is the current working version

### Customization — new, not yet built
- Users can change the keycap's look: a few preset colors and/or patterns to choose from
- Selection applied live, no page reload
- Kept simple: a small swatch row, not a full custom color picker, for v1

## Wax Butter Squishy — shelved for now
Visual crack/reset animation worked, but synthesized crunch/pour audio never matched the reference feel. Set aside to focus on the clicker. Revisit later with a real audio sample if wanted.

## Vibe
Playful, not minimal — glow, springy motion. Sound and animation timing are the priority, not restraint.

## Out of scope for v1
- App Store / native app
- Haptics
- Accounts, saving progress, streaks/stats persistence
- Wax squishy toy (shelved)
- Full custom color picker (presets only for now)

## Definition of done
Can be added to iPhone home screen via Safari (or installed as a desktop app on laptop), the clicker works end-to-end (tap → animate → real sound), customization presets work, and it feels satisfying one-handed.

## Build flow across tools

**1. Chat (done)**
Goal: validate the mechanics feel right before writing real project code.
Accomplished: both toys prototyped as a single test artifact, keyboard clicker feel + sound confirmed good, wax visuals confirmed good, wax sound identified as the one unresolved piece, PRD locked.
Exit criteria: nothing left to decide by talking it through — reached.

**2. Claude Code Desktop (next)**
Goal: turn the validated prototype into a real project with proper files and hosting.
To accomplish before moving on:
- Set up a real project folder with the HTML/CSS/JS split out (not one file)
- Add the customization presets (color/pattern swatches for the keycap)
- Confirm the clicker still feels right with real files in place
- Host it somewhere with a URL (e.g. GitHub Pages)
Exit criteria: a live URL you can open on your phone.

**3. iPhone Safari (test)**
Goal: confirm it actually feels good as a home-screen app, not just in a desktop browser.
To accomplish before moving on:
- Add to home screen, open it full-screen
- Test tap targets, sound playback, and pacing one-handed
- Note anything that feels off (lag, timing, sizing)
Exit criteria: a specific list of fixes, or "it feels good."

**4. Back to Claude Code (iterate)**
Goal: apply whatever the phone test surfaced.
Loop steps 2–3 until nothing's left on the list.

**5. Claude Design (optional, only if wanted later)**
Goal: polish visual style further once function is solid. Not required for v1 — only pull this in if you want a more designed look after the basics feel good.

