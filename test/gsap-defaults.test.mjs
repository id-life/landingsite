// The original site set no gsap.defaults, so every tween of his that names no duration or ease plays GSAP's own:
// 0.5 s and power1.out. This site keeps them (a site-wide 0.3 s and quint out had changed every such tween of his).
// Only reduced motion changes the default duration (MOT-02).
import { describe, expect, test } from 'vitest';
import gsap from 'gsap';
import { GSAP_DEFAULT } from '@/motion/tokens';
import '@/motion/gsap';

describe("GSAP's defaults", () => {
  test("the token holds GSAP's own defaults, the original's", () => {
    expect(GSAP_DEFAULT.duration).toBe(0.5);
    expect(GSAP_DEFAULT.ease).toBe('power1.out');
  });

  test('a tween that names no duration or ease plays 0.5 s and power1.out', () => {
    const tween = gsap.to({ v: 0 }, { v: 1, paused: true });
    expect(tween.duration()).toBe(0.5);
    // GSAP's own ease, power1.out (t => 1 - (1 - t)^2): half way in time is 0.75 of the way (quint out is 0.97).
    tween.progress(0.5);
    expect(tween.targets()[0].v).toBeCloseTo(0.75, 5);
    tween.kill();
  });
});
