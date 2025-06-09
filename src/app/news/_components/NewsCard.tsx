'use client';

import { useRouter } from 'next/navigation';

export default function NewsCard() {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(
      '/news/the_immortal_ragons_approach_to_longevity_investment_balancing_radical_innovation_with_scientific_rigor',
    );
  };

  return (
    <div onClick={handleCardClick} className="cursor-pointer bg-white p-4">
      <div className="flex items-center gap-2 text-base font-medium text-black/50">
        <img src="/imgs/news/article_logo.webp" className="size-6" alt="" />
        Immortal Dragons
      </div>
      <h3 className="mt-2.5 line-clamp-3 text-lg font-semibold">
        The Immortal Dragons Approach to Longevity Investment: Balancing Radical Innovation with Scientific Rigor
      </h3>
      <div className="mt-4 font-medium text-black/50">
        Article <span className="px-1">·</span> 2 Hours Ago
      </div>
      <p className="mt-4 line-clamp-3 text-sm font-medium">
        &quot;The Case Against Death&quot; represents a comprehensive philosophical examination of death from a rationalist
        perspective. While specific details of the book may vary (as there are several works with similar titles in the
        anti-death literature), such works typically present structured arguments against the acceptance of death as a natural
        or necessary part of human existence.
      </p>
    </div>
  );
}
