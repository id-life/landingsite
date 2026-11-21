import HomeEntry from '@/app/(home)/_components/HomeEntry';
import RouteNoScript from '@/components/seo/RouteNoScript';

export default function Page() {
  return (
    <>
      <HomeEntry />
      {/* What this route shows, for a visitor without JavaScript (PERF-03 A1); never drawn when JavaScript runs. */}
      <RouteNoScript route="spectrum" />
    </>
  );
}
