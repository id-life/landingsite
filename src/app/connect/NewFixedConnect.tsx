import FixedConnectPage1 from '@/app/connect/FixedConnectPage1';
import FixedConnectPage2 from '@/app/connect/FixedConnectPage2';
import FixedConnectPage3 from '@/app/connect/FixedConnectPage3';

export default function NewFixedConnect() {
  return (
    <div id="fixed-connect" style={{ perspective: '1200px' }} className="pointer-events-none fixed left-0 top-0 z-10 opacity-0">
      <FixedConnectPage1 />
    </div>
  );
}
