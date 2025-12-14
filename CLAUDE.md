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

- Home (`/`), About, Digital Twin, Spectrum (with sub-pages: disease-management, influence-network), Portfolio, Presence, News (with `[id]` dynamic route), Podcast (with `[id]` dynamic route), Insights, Connect

### Important Configuration

**Next.js Config (`next.config.mjs`):**

- React Strict Mode disabled (`reactStrictMode: false`) - intentional for GSAP/Three.js compatibility
- SVG handling with `@svgr/webpack` for component imports (`*.svg?component`)
- GLSL shader file processing (`*.glsl`, `*.vert`, `*.frag`) via raw-loader + glslify-loader
- Three.js transpilation
- Custom cache handler (`cache-handler.mjs`)
- Sentry integration with source map uploads

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

## Code Style

- Avoid code duplication - extract common types and components.
- Keep components focused - use hooks and component composition.
- Follow React best practices - proper Context usage, state management.
- Use TypeScript strictly - leverage type safety throughout.
- Build React features out of small, atomic components. Push data fetching, stores, and providers down to the feature or tab that actually needs them so switching views unmounts unused logic and prevents runaway updates instead of centralizing everything in a mega component.

### React Best Practices

#### Avoid useCallback Overuse

Only use `useCallback` when:

- The callback is passed to a memoized child component
- The callback has dependencies that genuinely need to be tracked

**DON'T** wrap callbacks with empty dependencies or callbacks that aren't passed to memoized components:

```typescript
// ❌ Bad: Unnecessary useCallback
const handleClose = useCallback(() => {
  window.api.mainPanel.close();
}, []);

// ✅ Good: Regular function
const handleClose = () => {
  window.api.mainPanel.close();
};
```

#### Fix Circular Dependencies in useEffect

When event handlers need to access latest state without re-subscribing, use refs:

```typescript
// ❌ Bad: Circular dependency causes re-subscription every state change
const handleMouseMove = useCallback(
  (e: MouseEvent) => {
    if (!isDragging) return;
    // ... logic
  },
  [isDragging],
);

useEffect(() => {
  if (isDragging) {
    window.addEventListener('mousemove', handleMouseMove);
  }
  return () => window.removeEventListener('mousemove', handleMouseMove);
}, [isDragging, handleMouseMove]); // Circular dependency!

// ✅ Good: Use ref and define handler inside effect
const isDraggingRef = useRef(isDragging);
isDraggingRef.current = isDragging;

useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    // ... logic
  };

  if (isDragging) {
    window.addEventListener('mousemove', handleMouseMove);
  }
  return () => window.removeEventListener('mousemove', handleMouseMove);
}, [isDragging]); // No circular dependency
```

#### IPC Subscriptions Should Subscribe Once

IPC listeners should subscribe once on mount, not re-subscribe on state changes:

```typescript
// ❌ Bad: Re-subscribes every time isHovering changes
useEffect(() => {
  const cleanup = window.api.menu.onCheckMousePosition(() => {
    if (!isHovering) {
      window.api.menu.hide();
    }
  });
  return cleanup;
}, [isHovering]); // Re-subscribes unnecessarily

// ✅ Good: Subscribe once, access state via ref
const isHoveringRef = useRef(isHovering);
isHoveringRef.current = isHovering;

useEffect(() => {
  const cleanup = window.api.menu.onCheckMousePosition(() => {
    if (!isHoveringRef.current) {
      window.api.menu.hide();
    }
  });
  return cleanup;
}, []); // Subscribe once
```

#### Avoid useState for Static Values

Don't use `useState` for values that never change:

```typescript
// ❌ Bad: useState for static value
const [versions] = useState(window.electron.process.versions);

// ✅ Good: Direct constant
const versions = window.electron.process.versions;
```

## IMPORTANT

- **Backward Compatibility**: When adding new features or fixing bugs, pay special attention to maintaining compatibility with existing functionality. Test affected areas thoroughly.
- **Documentation**: When you need to check official documentation, use Context7 to get the latest information, or search for it if unavailable.
- **CLAUDE.md Updates**: When making major changes involving architectural alterations, request an update to CLAUDE.md at the end of the task.
