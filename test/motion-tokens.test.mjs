// MOT-08: one motion language. The eases are defined once as bezier points; GSAP, CSS and motion must play the same
// curve under one name, and lint must keep timing literals inside src/motion.
import { ESLint } from 'eslint';
import { describe, expect, test } from 'vitest';
import { DURATION, EASE, EASE_POINTS, motionCssVariables } from '@/motion/tokens';
import { MOTION } from '@/motion/presets';

// Reference values of the named CSS curves (easings.net): easeOutQuint, easeInOutCubic, easeInQuint at x.
const quintOut = (x) => 1 - (1 - x) ** 5;
const cubicInOut = (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);
const quintIn = (x) => x ** 5;

describe('motion tokens', () => {
  test('the ease functions follow their bezier points (within 0.03 of the named curve)', () => {
    for (const x of [0.1, 0.25, 0.5, 0.75, 0.9]) {
      expect(Math.abs(EASE.out(x) - quintOut(x))).toBeLessThan(0.03);
      expect(Math.abs(EASE.inOut(x) - cubicInOut(x))).toBeLessThan(0.03);
      expect(Math.abs(EASE.in(x) - quintIn(x))).toBeLessThan(0.03);
    }
    for (const fn of Object.values(EASE)) {
      expect(fn(0)).toBe(0);
      expect(fn(1)).toBe(1);
    }
  });

  test('CSS and motion get the same points and durations', () => {
    const css = motionCssVariables();
    expect(css['--ease-out']).toBe(`cubic-bezier(${EASE_POINTS.out.join(', ')})`);
    expect(css['--ease-inOut']).toBe(`cubic-bezier(${EASE_POINTS.inOut.join(', ')})`);
    expect(css['--dur-section']).toBe(`${DURATION.section * 1000}ms`);
    expect(MOTION.fast.ease).toEqual([...EASE_POINTS.out]);
    expect(MOTION.fast.duration).toBe(DURATION.fast);
  });

  test('lint rejects timing literals outside src/motion and accepts tokens', async () => {
    const eslint = new ESLint();
    const lint = async (code, filePath) => (await eslint.lintText(code, { filePath }))[0].messages.map((m) => m.message);
    const bad = await lint(
      "import gsap from 'gsap';\nexport const a = () => { gsap.to('.x', { duration: 0.4, ease: 'power2.out' }); gsap.timeline({ duration: 1 }); };\n",
      'src/components/example.ts',
    );
    expect(bad.filter((m) => /MOT-08/.test(m))).toHaveLength(4); // duration and ease literals, plus the timeline duration (both rules)
    const good = await lint(
      "import gsap from 'gsap';\nimport { DURATION, EASE } from '@/motion/tokens';\nexport const a = () => { gsap.to('.x', { duration: DURATION.base, ease: EASE.out }); gsap.timeline({ defaults: { duration: DURATION.fast } }); };\n",
      'src/components/example.ts',
    );
    expect(good.filter((m) => /MOT-08/.test(m))).toHaveLength(0);
  }, 30_000);
});
