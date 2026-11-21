import { atom } from 'jotai';

/** The hero (dragon model and wordmark textures) has loaded and committed: the loader may leave. */
export const heroReadyAtom = atom<boolean>(false);

/** The client's loader is in the document: the server's copy of it (ServerLoader) may leave. */
export const serverLoaderHandedOverAtom = atom<boolean>(false);

/** Furthest experience section (NAV_LIST index) the visitor has reached in this tab. */
export const furthestSectionAtom = atom<number>(0);

/** Later-section 3D asset groups, mounted when the visitor approaches their section. */
export type DeferredGroup = 'twin' | 'jellyfish';

/** A group finished loading: the group waiting behind it may start. */
export const deferredSettledAtom = atom<Record<DeferredGroup, boolean>>({ twin: false, jellyfish: false });
