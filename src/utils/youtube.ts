/** The public watch page of a YouTube video: the real link behind a card that plays the video in a modal. */
export const youtubeWatchUrl = (videoId: string) => `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
