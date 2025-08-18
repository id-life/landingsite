import MobileNav from './MobileNav';
import PCNav from './PCNav';

export default function ClientNav() {
  return (
    <>
      <MobileNav />
      <PCNav />
      <div className="absolute -z-10">
        Immortal Dragons is a purpose-driven longevity fund headquartered in Biopolis, Singapore.
      </div>
    </>
  );
}
