import { StatsGl } from '@react-three/drei';

// Development-only frame-rate and GPU timing overlay (NEXT_PUBLIC_ENABLE_PREF=1 npm run dev; see ThreeWrapper).
export default function PrefHook() {
  return <StatsGl />;
}
