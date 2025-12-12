'use client';

import { useState } from 'react';
import Pagination from './Pagination';

export type PodcastItem = {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  duration: string;
  spotifyUrl?: string;
  appleUrl?: string;
  googleUrl?: string;
};

// Mock data - 可以替换为实际数据
const mockPodcastData: PodcastItem[] = [
  {
    id: '1',
    episodeNumber: 1,
    title: 'Unlocking the Secrets of Cellular Aging',
    description: 'Dr. Sarah Chen discusses breakthroughs in understanding how our cells age.',
    duration: '01:10:20',
    spotifyUrl: '#',
    appleUrl: '#',
    googleUrl: '#',
  },
  {
    id: '2',
    episodeNumber: 2,
    title: 'The Science of Longevity Investing',
    description: 'Industry experts share insights on identifying promising longevity ventures.',
    duration: '00:55:42',
    spotifyUrl: '#',
    appleUrl: '#',
    googleUrl: '#',
  },
  {
    id: '3',
    episodeNumber: 3,
    title: 'AI-Driven Drug Discovery Revolution',
    description: 'How machine learning is transforming pharmaceutical research.',
    duration: '01:05:18',
    spotifyUrl: '#',
    appleUrl: '#',
    googleUrl: '#',
  },
  {
    id: '4',
    episodeNumber: 4,
    title: 'Regenerative Medicine Frontiers',
    description: 'Exploring the cutting edge of tissue engineering and organ repair.',
    duration: '00:48:35',
    spotifyUrl: '#',
    appleUrl: '#',
    googleUrl: '#',
  },
];

const ITEMS_PER_PAGE = 3;

function SpotifyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 1.875C5.5125 1.875 1.875 5.5125 1.875 10C1.875 14.4875 5.5125 18.125 10 18.125C14.4875 18.125 18.125 14.4875 18.125 10C18.125 5.5125 14.4875 1.875 10 1.875ZM13.5625 13.5C13.4375 13.6875 13.1875 13.75 13 13.625C11.0625 12.4375 8.625 12.1875 5.8125 12.8125C5.5625 12.875 5.375 12.6875 5.3125 12.5C5.25 12.25 5.4375 12.0625 5.625 12C8.6875 11.3125 11.375 11.625 13.5 12.9375C13.75 13.0625 13.8125 13.3125 13.5625 13.5ZM14.5 11.375C14.375 11.5625 14.0625 11.625 13.875 11.5C11.625 10.125 8.25 9.6875 5.5625 10.5C5.3125 10.5625 5.0625 10.4375 5 10.1875C4.9375 9.9375 5.0625 9.6875 5.3125 9.625C8.375 8.6875 12.0625 9.1875 14.625 10.75C14.8125 10.875 14.875 11.1875 14.5 11.375ZM14.5625 9.1875C11.875 7.5625 7.5 7.4375 5.125 8.1875C4.8125 8.25 4.5 8.0625 4.4375 7.75C4.375 7.4375 4.5625 7.125 4.875 7.0625C7.625 6.25 12.375 6.375 15.4375 8.1875C15.6875 8.3125 15.8125 8.625 15.625 8.875C15.4375 9.125 15.125 9.25 14.5625 9.1875Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ApplePodcastIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 1.875C5.5125 1.875 1.875 5.5125 1.875 10C1.875 14.4875 5.5125 18.125 10 18.125C14.4875 18.125 18.125 14.4875 18.125 10C18.125 5.5125 14.4875 1.875 10 1.875ZM10 5C10.6875 5 11.25 5.5625 11.25 6.25C11.25 6.9375 10.6875 7.5 10 7.5C9.3125 7.5 8.75 6.9375 8.75 6.25C8.75 5.5625 9.3125 5 10 5ZM12.5 14.375C12.5 14.6875 12.1875 15 11.875 15H8.125C7.8125 15 7.5 14.6875 7.5 14.375V13.75C7.5 13.4375 7.8125 13.125 8.125 13.125H8.75V10H8.125C7.8125 10 7.5 9.6875 7.5 9.375V8.75C7.5 8.4375 7.8125 8.125 8.125 8.125H11.25C11.5625 8.125 11.875 8.4375 11.875 8.75V13.125H12.5C12.8125 13.125 13.125 13.4375 13.125 13.75V14.375H12.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GooglePodcastIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2.5V5.625" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 14.375V17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 7.5V12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6.25 5V8.125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6.25 10.625V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M13.75 5V9.375" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M13.75 11.875V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M2.5 8.125V11.875" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M17.5 8.125V11.875" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 4.5V7L8.5 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PodcastCard({ item }: { item: PodcastItem }) {
  return (
    <div className="group rounded-sm bg-gray-800/60 p-4 transition-colors hover:bg-gray-800/80">
      <div className="flex items-start justify-between">
        <span className="font-oxanium text-xs font-semibold text-purple">No.{item.episodeNumber}</span>
        <div className="flex items-center gap-1 text-gray-450">
          <ClockIcon />
          <span className="font-oxanium text-xs">{item.duration}</span>
        </div>
      </div>

      <h3 className="mt-2 line-clamp-1 font-poppins text-base font-semibold leading-tight">{item.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-gray-450">{item.description}</p>

      <div className="mt-3 flex items-center gap-3">
        {item.spotifyUrl && (
          <a
            href={item.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-450 transition-colors hover:text-[#1DB954]"
            aria-label="Listen on Spotify"
          >
            <SpotifyIcon />
          </a>
        )}
        {item.appleUrl && (
          <a
            href={item.appleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-450 transition-colors hover:text-[#A855F7]"
            aria-label="Listen on Apple Podcasts"
          >
            <ApplePodcastIcon />
          </a>
        )}
        {item.googleUrl && (
          <a
            href={item.googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-450 transition-colors hover:text-[#4285F4]"
            aria-label="Listen on Google Podcasts"
          >
            <GooglePodcastIcon />
          </a>
        )}
      </div>
    </div>
  );
}

export default function PodcastSection() {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(mockPodcastData.length / ITEMS_PER_PAGE);
  const currentItems = mockPodcastData.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  return (
    <div className="flex h-full flex-col">
      <h2 className="font-oxanium text-2xl font-semibold uppercase">PODCAST</h2>
      <p className="mt-2 text-sm text-gray-450">Deep dives into longevity, science, and innovation.</p>

      <div className="mt-9 flex flex-1 flex-col justify-start gap-4">
        {currentItems.map((item) => (
          <PodcastCard key={item.id} item={item} />
        ))}
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}
