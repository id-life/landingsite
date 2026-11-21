'use client';

import { RefObject, useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { audioRefAtom, currentAudioAtom, PlayList } from '@/atoms/audio-player';
import { ANALYTICS_ENABLED } from '@/lib/analytics/config';
import { AudioTarget, bindAudioAnalytics, ListenState, newListenState } from '@/lib/analytics/audio';

/**
 * Podcast listening analytics for one player (DATA-12, see lib/analytics/audio.ts). `audio` is the element or a ref
 * to it; `target` is null for anything that is not an episode (music). One state per episode for the life of the
 * calling component, which is one page: the episode page, or the experience for the site player.
 *
 * It reads neither the playing time nor the progress from the store (they change about four times a second; only
 * what draws them reads them), so it adds no render while an episode plays. With analytics off it attaches nothing.
 */
export function useAudioAnalytics(
  audio: HTMLAudioElement | RefObject<HTMLAudioElement | null> | null,
  target: AudioTarget | null,
) {
  const states = useRef(new Map<string, ListenState>());
  const episodeId = target?.episode_id;
  const show = target?.show;
  const source = target?.source;
  const duration = target?.duration;

  useEffect(() => {
    if (!ANALYTICS_ENABLED || !episodeId || !show || !source) return;
    const element = audio && 'current' in audio ? audio.current : audio;
    if (!element) return;
    let state = states.current.get(episodeId);
    if (!state) {
      state = newListenState();
      states.current.set(episodeId, state);
    }
    return bindAudioAnalytics(element, { episode_id: episodeId, show, source, duration }, state);
  }, [audio, episodeId, show, source, duration]);
}

/** The site player's episodes (its podcast lists); music tracks are not counted here (music_play covers them). */
export function useSitePlayerAnalytics() {
  const audio = useAtomValue(audioRefAtom);
  const current = useAtomValue(currentAudioAtom);
  const isEpisode = current != null && current.category !== PlayList.MUSIC;
  useAudioAnalytics(
    audio,
    isEpisode
      ? { episode_id: String(current.id), show: current.category, source: 'site_player', duration: current.duration }
      : null,
  );
}
