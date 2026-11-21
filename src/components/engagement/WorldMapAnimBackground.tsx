import { cn } from '@/utils';
import { forwardRef, memo, useEffect, useId, useRef } from 'react';
// The map's 3,085 dots as one path (scripts/merge-map-dots.mjs, MOT-11): the same pixels as world-map.svg's circles.
import WorldMapSVG from '@/../public/svgs/engagement/world-map-path.svg?component';

interface WorldMapAnimBackgroundProps {
  className?: string;
  radius?: number;
}

// SVG viewBox dimensions matching WorldMapSVG's inherent size for coordinate mapping
// Assuming WorldMapSVG's default viewBox is "0 0 126 60" based on usage below.
// If WorldMapSVG's viewBox changes, this needs to be updated.

export const WorldMapAnimBackground = memo(
  forwardRef<SVGSVGElement, WorldMapAnimBackgroundProps>(function WorldMapAnimBackground(
    { className, radius = 80 },
    ref, // This ref is for the WorldMapSVG itself
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const layerRef = useRef<HTMLDivElement>(null);
    const spotRef = useRef<SVGCircleElement>(null);
    // MOT-11: one id for the life of the map (it was a new random id on every render, so every pointer move
    // re-resolved the filter and the mask).
    const filterId = `pulse-filter-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

    // The spotlight layer is always mounted and hidden while the pointer is outside the map (it used to mount a second
    // copy of the map on enter, and set React state on every move). A move only places the mask's circle, in the
    // container's pixels, measured at each move as before (the map can move under a still pointer mid-transition).
    useEffect(() => {
      const container = containerRef.current;
      const layer = layerRef.current;
      const spot = spotRef.current;
      if (!container || !layer || !spot) return;
      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        spot.setAttribute('cx', String(e.clientX - rect.left));
        spot.setAttribute('cy', String(e.clientY - rect.top));
      };

      const handleMouseEnter = (e: MouseEvent) => {
        handleMouseMove(e);
        layer.style.visibility = 'visible';
      };

      const handleMouseLeave = () => {
        layer.style.visibility = 'hidden';
      };

      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, []);

    return (
      <div ref={containerRef} className={cn('relative', className)}>
        {/* Background WorldMapSVG - normal display */}
        <WorldMapSVG
          ref={ref}
          className={cn(
            'world-map-img pointer-events-none select-none bg-top [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]',
            // 'opacity-0', // anim init state
          )}
        />

        {/* Effect layer - only visible in circular area around mouse */}
        <div ref={layerRef} className="absolute inset-0" style={{ visibility: 'hidden' }}>
          {/* SVG for filters and masks */}
          <svg className="pointer-events-none absolute inset-0 size-0">
            <defs>
              {/* Pulse filter */}
              <filter id={filterId} x="-100%" y="-100%" width="300%" height="300%">
                {/* Convert everything to pure white with moderate intensity */}
                <feColorMatrix
                  in="SourceGraphic"
                  type="matrix"
                  values="0 0 0 0 0.6
                          0 0 0 0 0.6
                          0 0 0 0 0.6
                          0 0 0 8 0"
                  result="pureWhite"
                />

                {/* Create a tight glow for size enhancement - larger but still crisp */}
                <feGaussianBlur in="pureWhite" stdDeviation="0.9" result="tightGlow" />

                {/* Create a medium glow for smoothing */}
                <feGaussianBlur in="pureWhite" stdDeviation="1.3" result="mediumGlow" />

                {/* Moderate brightness for tight glow */}
                <feColorMatrix
                  in="tightGlow"
                  type="matrix"
                  values="1 0 0 0 0
                          0 1 0 0 0
                          0 0 1 0 0
                          0 0 0 3.5 0"
                  result="brightTightGlow"
                />

                {/* Subtle brightness for medium glow */}
                <feColorMatrix
                  in="mediumGlow"
                  type="matrix"
                  values="1 0 0 0 0
                          0 1 0 0 0
                          0 0 1 0 0
                          0 0 0 1 0"
                  result="brightMediumGlow"
                />

                {/* Layer effects: original particles + enhanced glows for bigger appearance */}
                <feComposite in="pureWhite" in2="brightTightGlow" operator="screen" result="layer1" />
                <feComposite in="layer1" in2="brightMediumGlow" operator="screen" />
              </filter>

              {/* Radial gradient for soft circular mask */}
              <radialGradient id={`pulse-gradient-${filterId}`}>
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="25%" stopColor="white" stopOpacity="1" />
                <stop offset="40%" stopColor="white" stopOpacity="0.6" />
                <stop offset="55%" stopColor="white" stopOpacity="0.5" />
                <stop offset="70%" stopColor="white" stopOpacity="0.2" />
                <stop offset="85%" stopColor="white" stopOpacity="0.05" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>

              {/* Soft circular mask using radial gradient */}
              <mask id={`pulse-mask-${filterId}`}>
                <rect width="100%" height="100%" fill="black" />
                <circle ref={spotRef} cx={0} cy={0} r={radius * 1.0} fill={`url(#pulse-gradient-${filterId})`} />
              </mask>
            </defs>
          </svg>

          {/* Enhanced WorldMapSVG layer with white effect */}
          {/* Not .world-map-img: the section's entrance tween never reached this copy, which mounted after it. */}
          <WorldMapSVG
            className={cn(
              'pointer-events-none absolute inset-0 select-none bg-top [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]',
            )}
            style={{
              filter: `url(#${filterId})`,
              mask: `url(#pulse-mask-${filterId})`,
            }}
          />
        </div>
      </div>
    );
  }),
);
WorldMapAnimBackground.displayName = 'WorldMapAnimBackground';
