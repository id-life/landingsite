import ScrollDown from '@/components/common/ScrollDown';
import { NAV_LIST } from '@/components/nav/nav';

export default function Vision() {
  return (
    <div id={NAV_LIST[0].id} className="page-container p-8">
      Vision
      <ScrollDown />
    </div>
  );
}
