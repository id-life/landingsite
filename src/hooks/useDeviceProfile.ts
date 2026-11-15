'use client';

import { useSyncExternalStore } from 'react';
import {
  COARSE_POINTER_QUERY,
  COMPACT_HEIGHT_QUERY,
  HOVER_QUERY,
  PHONE_TREE_QUERY,
  REDUCED_MOTION_QUERY,
  WIDTH_CLASS_QUERY,
} from '@/styles/device-classes';

export type WidthClass = keyof typeof WIDTH_CLASS_QUERY;

export type DeviceProfile = {
  width: WidthClass;
  height: 'compact' | 'regular';
  pointer: 'coarse' | 'fine';
  hover: boolean;
  reducedMotion: boolean;
  /** Which experience is mounted: the phone deck or the desktop deck (PHONE_TREE_QUERY). */
  tree: 'phone' | 'desktop';
  /**
   * The 3D budget class from size and input alone (a phone, a tablet, a desktop). The GPU tiers (MOT-06) refine it
   * from measured frame times; this is the starting point they read.
   */
  tier3d: 'low' | 'mid' | 'high';
};

/**
 * One set of matchMedia listeners for the whole app (RWD-02). Everything that used to ask `max-width: 768px` on its
 * own (21 useIsMobile calls, three more matchMedia calls and a user-agent sniff) reads this profile instead.
 *
 * The tree flips only after its query has been stable for TREE_SETTLE_MS, so a Split View drag, a toolbar that
 * collapses or a rotation in progress never mounts the other experience and back. The other fields follow at once.
 */
const TREE_SETTLE_MS = 200;

type Store = { profile: DeviceProfile | null; listeners: Set<() => void> };
const store: Store = { profile: null, listeners: new Set() };
let started = false;
let treeTimer: ReturnType<typeof setTimeout> | null = null;

const match = (query: string) => window.matchMedia(query).matches;

function widthClass(): WidthClass {
  return (Object.keys(WIDTH_CLASS_QUERY) as WidthClass[]).find((name) => match(WIDTH_CLASS_QUERY[name])) ?? 'large';
}

function read(tree: DeviceProfile['tree']): DeviceProfile {
  const width = widthClass();
  const pointer = match(COARSE_POINTER_QUERY) ? 'coarse' : 'fine';
  return {
    width,
    height: match(COMPACT_HEIGHT_QUERY) ? 'compact' : 'regular',
    pointer,
    hover: match(HOVER_QUERY),
    reducedMotion: match(REDUCED_MOTION_QUERY),
    tree,
    tier3d: tree === 'phone' ? 'low' : pointer === 'coarse' || width !== 'large' ? 'mid' : 'high',
  };
}

const currentTree = (): DeviceProfile['tree'] => (match(PHONE_TREE_QUERY) ? 'phone' : 'desktop');

function publish(next: DeviceProfile) {
  const prev = store.profile;
  if (prev && (Object.keys(next) as (keyof DeviceProfile)[]).every((key) => prev[key] === next[key])) return;
  store.profile = next;
  // Readable from CSS, probes and the e2e suite without React: <html data-tree data-width-class data-pointer>.
  const root = document.documentElement;
  root.dataset.tree = next.tree;
  root.dataset.widthClass = next.width;
  root.dataset.heightClass = next.height;
  root.dataset.pointer = next.pointer;
  for (const listener of store.listeners) listener();
}

function onChange() {
  const profile = store.profile;
  const tree = currentTree();
  // Everything but the tree at once; the tree after it has settled.
  publish(read(profile?.tree ?? tree));
  if (profile && tree !== profile.tree) {
    if (treeTimer) clearTimeout(treeTimer);
    treeTimer = setTimeout(() => {
      treeTimer = null;
      publish(read(currentTree()));
    }, TREE_SETTLE_MS);
  }
}

function start() {
  if (started || typeof window === 'undefined') return;
  started = true;
  publish(read(currentTree()));
  const queries = [
    ...Object.values(WIDTH_CLASS_QUERY),
    COMPACT_HEIGHT_QUERY,
    PHONE_TREE_QUERY,
    COARSE_POINTER_QUERY,
    HOVER_QUERY,
    REDUCED_MOTION_QUERY,
  ];
  for (const query of queries) window.matchMedia(query).addEventListener('change', onChange);
}

function subscribe(listener: () => void) {
  start();
  store.listeners.add(listener);
  return () => store.listeners.delete(listener);
}

const getSnapshot = () => {
  start();
  return store.profile;
};
// Unknown on the server and during hydration: the layout comes from CSS media queries until then.
const getServerSnapshot = () => null;

/** The device profile, or null on the server and before hydration. */
export function useDeviceProfile(): DeviceProfile | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** The profile outside React (event handlers, module code). Null on the server. */
export function getDeviceProfile(): DeviceProfile | null {
  return getSnapshot();
}
