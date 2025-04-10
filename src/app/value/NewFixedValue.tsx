import FixedValuePage1 from '@/app/value/FixedValuePage1';
import FixedValuePage2 from '@/app/value/FixedValuePage2';
import FixedValuePage3 from '@/app/value/FixedValuePage3';

export default function NewFixedValue() {
  return (
    <div id="fixed-value" style={{ perspective: '1200px' }} className="pointer-events-none fixed left-0 top-0 z-10 opacity-0">
      <FixedValuePage1 />
      <FixedValuePage2 />
      <FixedValuePage3 />
    </div>
  );
}
