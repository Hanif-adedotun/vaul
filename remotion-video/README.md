# VAUL Promotional Video

A motion design video created with Remotion showcasing VAUL's features and capabilities.

## Setup

1. Navigate to the remotion-video directory:
```bash
cd remotion-video
```

2. Install dependencies:
```bash
npm install
```

3. Start the Remotion Studio (for preview and development):
```bash
npm run dev
```

This will open Remotion Studio in your browser where you can preview the video and make adjustments.

4. Render the video:
```bash
npm run build
```

The rendered video will be saved to `out/video.mp4`.

## Video Structure

The video consists of 3 main scenes:

1. **Logo Intro** (0-3s): VAUL logo pops up with tagline
2. **Terminal Question** (3-8s): Background transitions to terminal, shows typing animation, then question appears
3. **App Demo** (8-15s): 
   - Saving commands demonstration (exact UI match)
   - Retrieving commands demonstration (exact UI match)

## Customization

- Edit scene timings in `src/VaulPromo.tsx`
- Modify individual scenes in `src/scenes/`
- Adjust colors and styling to match VAUL's design system

## Requirements

- Node.js 18+
- npm or yarn

