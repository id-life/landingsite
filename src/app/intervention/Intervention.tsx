import { NAV_LIST } from '@/components/nav/nav';

export default function Intervention() {
  return (
    <div id={NAV_LIST[4].id} className="page-height mt-37 px-12">
      <h2 className="page-title">Intervention Center</h2>
      <p className="font-migrena text-2xl/12 font-bold uppercase">Thailand</p>
      <div className="mt-8 flex gap-7">
        <div className="processes-clip px-3.5 py-2 text-xl/5 font-semibold text-white capitalize">&nbsp;Novel interventions</div>
        <div className="processes-clip px-3.5 py-2 text-xl/5 font-semibold text-white capitalize">&nbsp;minicircle follistatin gene therapy</div>
        <div className="processes-clip px-3.5 py-2 text-xl/5 font-semibold text-white capitalize">&nbsp;Novel interventions</div>
        <div className="processes-clip px-3.5 py-2 text-xl/5 font-semibold text-white capitalize">&nbsp;Novel interventions</div>
      </div>
    </div>
  );
}
