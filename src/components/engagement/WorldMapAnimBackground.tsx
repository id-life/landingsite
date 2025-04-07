import { cn } from '@/utils';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { WorldMapSVG } from '../svg';
import gsap from 'gsap';

interface WorldMapAnimBackgroundProps {
  className?: string;
  radius?: number; // 鼠标影响半径
  animationDuration?: number; // 动画持续时间
  animationScale?: number; // 动画缩放比例
  fadeOutThreshold?: number; // 开始淡出的阈值 (0-1)
}

// SVG viewBox dimensions matching WorldMapSVG's inherent size for coordinate mapping
// Assuming WorldMapSVG's default viewBox is "0 0 126 60" based on usage below.
// If WorldMapSVG's viewBox changes, this needs to be updated.
const svgViewBox = { w: 126, h: 60 };

export const WorldMapAnimBackground = forwardRef<SVGSVGElement, WorldMapAnimBackgroundProps>(function WorldMapAnimBackground(
  {
    className,
    radius = 500,
    animationDuration = 0.5,
    animationScale = 1.6,
    fadeOutThreshold = 0.8, // 默认在80%半径处开始淡出
  },
  ref, // This ref is for the WorldMapSVG itself
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const particlesRef = useRef<SVGCircleElement[]>([]);
  const animationRef = useRef<{ [key: string]: gsap.core.Tween | null }>({});

  // Initialize particle and background light animation
  useEffect(() => {
    if (!containerRef.current) return;

    // --- Particle Initialization ---
    const circles = containerRef.current.querySelectorAll('svg.world-map-img circle'); // Target circles within the map SVG
    particlesRef.current = Array.from(circles) as SVGCircleElement[];

    particlesRef.current.forEach((circle) => {
      circle.setAttribute('data-original-fill', circle.getAttribute('fill') || '#ffffff33');
      circle.setAttribute('data-original-r', circle.getAttribute('r') || '0.245');
    });

    return () => {
      // Cleanup particle animations
      Object.values(animationRef.current).forEach((animation) => {
        if (animation) animation.kill();
      });
    };
  }, []); // Run only once on mount

  // Handle mouse move for particle interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });

    // 检查每个粒子是否在鼠标影响范围内
    particlesRef.current.forEach((circle) => {
      const cx = parseFloat(circle.getAttribute('cx') || '0');
      const cy = parseFloat(circle.getAttribute('cy') || '0');

      // 将SVG坐标转换为屏幕坐标
      const svgRect = circle.ownerSVGElement?.getBoundingClientRect();
      if (!svgRect) return;

      const svgWidth = svgRect.width;
      const svgHeight = svgRect.height;

      const screenX = (cx / 126) * svgWidth;
      const screenY = (cy / 60) * svgHeight;

      // 计算距离
      const distance = Math.sqrt(Math.pow(screenX - x, 2) + Math.pow(screenY - y, 2));

      // 如果粒子在影响范围内
      if (distance < radius) {
        const particleId = circle.getAttribute('data-id') || Math.random().toString();
        circle.setAttribute('data-id', particleId);

        // 计算影响强度 (0-1)
        const intensity = 1 - distance / radius;

        // 如果粒子已经有动画，先停止
        if (animationRef.current[particleId]) {
          animationRef.current[particleId]?.kill();
        }

        // 创建新动画
        const originalFill = circle.getAttribute('data-original-fill') || '#ffffff33';
        const originalR = parseFloat(circle.getAttribute('data-original-r') || '0.245');

        // 根据强度调整动画参数
        // 使用自定义的淡出阈值，确保最外层的粒子不会完全消失
        let targetOpacity = 0.8;
        if (intensity < fadeOutThreshold) {
          // 在阈值以下，粒子保持原始状态
          targetOpacity = 0.2;
        } else {
          // 在阈值以上，粒子逐渐变亮
          targetOpacity = 0.2 + 0.6 * ((intensity - fadeOutThreshold) / (1 - fadeOutThreshold));
        }

        const targetScale = 1 + (animationScale - 1) * intensity;

        // 创建动画
        animationRef.current[particleId] = gsap.to(circle, {
          attr: { r: originalR * targetScale },
          fill: `rgba(255, 255, 255, ${targetOpacity})`,
          duration: animationDuration,
          ease: 'power2.out',
        });
      } else {
        // 如果粒子不在影响范围内，恢复原始状态
        const particleId = circle.getAttribute('data-id');
        if (particleId && animationRef.current[particleId]) {
          animationRef.current[particleId]?.kill();

          const originalFill = circle.getAttribute('data-original-fill') || '#ffffff33';
          const originalR = parseFloat(circle.getAttribute('data-original-r') || '0.245');

          animationRef.current[particleId] = gsap.to(circle, {
            attr: { r: originalR },
            fill: originalFill,
            duration: animationDuration,
            ease: 'power2.out',
          });
        }
      }
    });
  };

  // 处理鼠标离开
  const handleMouseLeave = () => {
    setIsHovering(false);

    // 恢复所有粒子的原始状态
    particlesRef.current.forEach((circle) => {
      const particleId = circle.getAttribute('data-id');
      if (particleId && animationRef.current[particleId]) {
        animationRef.current[particleId]?.kill();

        const originalFill = circle.getAttribute('data-original-fill') || '#ffffff33';
        const originalR = parseFloat(circle.getAttribute('data-original-r') || '0.245');

        animationRef.current[particleId] = gsap.to(circle, {
          attr: { r: originalR },
          fill: originalFill,
          duration: animationDuration,
          ease: 'power2.out',
        });
      }
    });
  };

  // 处理鼠标进入
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* The actual World Map with particles */}
      <WorldMapSVG
        ref={ref}
        className={cn(
          'world-map-img pointer-events-none select-none bg-top [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]',
          // 'opacity-0', // anim init state
        )}
      />
    </div>
  );
});
