# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Development Server**

```bash
npm run dev  # Start Next.js development server on localhost:3000
```

**Build & Production**

```bash
npm run build  # Create production build
npm start      # Start production server
```

**Code Quality**

```bash
npm run lint                              # Run ESLint
npm run lint --fix .                      # Fix linting issues
npx prettier --write --ignore-unknown .   # Format code
```

**Git Hooks**

- Pre-commit hooks automatically run linting and formatting via `lint-staged`
- Uses `simple-git-hooks` for git hook management

## Architecture Overview

This is a **Next.js 14 App Router** landing site for Immortal Dragons, a longevity fund. The codebase features:

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom configuration
- **3D Graphics**: Three.js with React Three Fiber (@react-three/fiber, @react-three/drei)
- **Animations**: GSAP (business license) with ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin, MotionPathPlugin
- **State Management**: Jotai atoms
- **Data Fetching**: TanStack Query
- **Monitoring**: Sentry error tracking

### Project Structure

**Core Directories:**

- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Reusable UI components organized by feature
- `src/atoms/` - Jotai state management atoms
- `src/hooks/` - React hooks, including animation and data fetching
- `src/constants/` - Configuration and static data
- `src/providers/` - React context providers
- `src/styles/` - Global styles and custom fonts

**Key Features:**

- **3D Models & WebGL**: Complex 3D visualizations using Three.js (`src/components/gl/`), including fluid simulations, particle effects, and animated dragon/animal models
- **Multi-language Support**: English/Chinese content switching
- **Responsive Design**: Mobile-first with custom breakpoints; separate mobile GL components (`MobileVisionGL`, `MobileConnectGL`)
- **Audio Player**: Custom audio player with waveform visualization (wavesurfer.js)
- **Interactive Animations**: GSAP-powered scroll-triggered animations with ScrollSmoother

**Pages:**

- Home (`/`), About, Digital Twin, Spectrum (with sub-pages), Portfolio, Presence, News, Podcast, Connect

### Important Configuration

**Next.js Config (`next.config.mjs`):**

- SVG handling with `@svgr/webpack` for component imports (`*.svg?component`)
- GLSL shader file processing (`*.glsl`, `*.vert`, `*.frag`)
- Three.js transpilation
- Custom cache handler
- Sentry integration

**Tailwind Config:**

- Custom breakpoints: `mobile` (max: 768px), `tablet` (768px-1540px)
- Extended spacing, colors, and typography
- Custom font variables for multiple typefaces

### Development Notes

**SVG Usage:**

- Import as components: `import Icon from './icon.svg?component'`
- Regular imports for assets: `import iconUrl from './icon.svg'`

**3D Development:**

- Models stored in `public/models/` (GLB format)
- Shaders in `src/components/gl/fluid/glsl/`
- Performance monitoring available via `r3f-perf`

**State Management:**

- Jotai atoms organized by feature in `src/atoms/`
- Key atoms: `nav`, `audio-player`, `twin`, `theme`, `podcast`, `engagement`, `geo`
- Providers wrapped in `src/providers/root.tsx` using a ProviderComposer pattern

**Styling:**

- Uses CSS custom properties for theme switching
- Component-specific styles in `src/styles/components/`
- Font files in `src/styles/fonts/`
