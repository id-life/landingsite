import NewsCard from './_components/NewsCard';

export default function NewsPage() {
  return (
    <div>
      <div>
        <h1 className="text-5xl/[4.5rem] font-semibold">Insights</h1>
        <div className="relative mt-4">
          <img className="w-full" src="/imgs/news/insights-bg.webp" alt="" />
          <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/30 backdrop-blur-sm">
            <p className="truncate p-4 text-2xl/7 font-semibold">
              The Immortal Dragons Approach to Longevity Investment: Balancing Radical Innovation with Scientific Rigor
            </p>
            <p className="mb-4 line-clamp-2 px-4 text-sm/5 font-medium">
              In the rapidly evolving field of longevity research, strategic partnerships have emerged as a critical factor for
              success. Immortal Dragons (ID), a mission-driven investment fund focused on extending human healthspan, has
              distinguished itself not only through its innovative investment approach but also through its strategic
              collaborations with research institutions,
            </p>
          </div>
        </div>
        <h2 className="mt-16 text-4xl/[3.375rem] font-semibold">Latest News</h2>
        <div className="mt-6 grid grid-cols-3 gap-x-6 gap-y-10">
          {Array.from({ length: 7 }).map((_, index) => (
            <NewsCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
