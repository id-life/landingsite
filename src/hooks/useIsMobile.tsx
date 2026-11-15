'use client';

import { useDeviceProfile } from './useDeviceProfile';

/**
 * True when the phone experience is mounted (the device profile's tree, RWD-02), null before hydration. Kept for the
 * call sites that only ask "phone deck or not"; new code reads useDeviceProfile().
 */
export const useIsMobile = () => {
  const profile = useDeviceProfile();
  return profile ? profile.tree === 'phone' : null;
};
