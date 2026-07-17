# Valora case study

A responsive, single-page product-design publication for Valora, a conceptual enterprise performance intelligence platform.

## Local development

```bash
npm.cmd install
npm.cmd run dev
```

## Verification

```bash
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

The production build is written to `dist/`. Temporary browser-QA scripts and screenshots remain local under `qa/` and are excluded from Git and Vercel deployments.

## Vercel deployment

Vercel can detect the Vite project without a `vercel.json` override. Use:

- Build command: `npm run build`
- Output directory: `dist`

Workflow-only project folders are excluded through `.vercelignore`; the deployable application source, public media, package lock, and Vite configuration remain available to the build.

## Content and assets

- Approved product framing and copy live in `01_CONTEXT/`.
- Original source exports remain in `02_ASSETS/SCREENS/`.
- Deployment-ready copies use normalized filenames in `public/media/`.
- The site uses the five authentic product screens as primary product evidence. `Website Inspiration.png` is used only as the supplied design-system source.
- The original design-system board remains in `public/media/design-system-reference.png`.
- Three dedicated, proportion-preserving design-system crops are published from `public/media/` for foundations, core components, and human control.

## Future walkthrough video

Add future media to `public/media/video/` using:

- `valora-walkthrough.webm`
- `valora-walkthrough.mp4`
- `valora-walkthrough-poster.jpg`

`src/components/WalkthroughVideo.tsx` is ready for WebM/MP4 fallback, poster display, muted inline autoplay, looping, native pause controls, off-screen pausing, and a reduced-motion fallback. It is intentionally not rendered until approved video assets exist.

## Assumptions

- Valora is presented as a conceptual product. The case study does not claim research validation, production deployment, or business outcomes.
- No prototype video, logo export, domain, or dedicated social image was supplied. The site therefore uses a restrained text mark, an SVG favicon, and the dashboard export for social metadata.
- The existing Vite + React + TypeScript setup was healthy and retained. Motion is implemented with the platform Intersection Observer API and CSS to avoid adding a runtime animation dependency.
