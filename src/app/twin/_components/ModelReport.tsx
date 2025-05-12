import ReportM01 from './ReportM01';
import ReportM02 from './ReportM02';
import ReportM03 from './ReportM03';

export default function ModelReport() {
  return (
    <>
      <div className="twin-title-item twin-title-M1 absolute bottom-32 left-[-80rem] z-20 max-w-[31.25rem]">
        <p className="text-xl/6 font-semibold">30 YEARS</p>
        <div className="mt-5 text-base font-medium">
          Living State:Gets up at 11 AM daily, continues sleeping after lunch until 2 PM before starting the day&apos;s
          activities. Long-term irregular living patterns, often staying up until ... <ReportM01 />
        </div>
        <p className="mt-2 text-base font-medium">
          生活状态：每天早上11点起床，午饭后继续睡觉，直到下午2点才开始一天的活动。长期不规律的生活模式，经常熬夜到3-4点……
        </p>
      </div>
      <div className="twin-title-item twin-title-M2 absolute bottom-32 left-[-80rem] z-20 max-w-[31.25rem]">
        <p className="text-xl/6 font-semibold">5 YEARS</p>
        <div className="mt-5 text-base font-medium">
          Balanced and healthy lifestyle. Starts the day at 7 AM with 500ml of warm water, followed by 15 minutes of room
          tidying and simple stretches before arriving at ...
          <ReportM02 />
        </div>
        <p className="mt-2 text-base font-medium">
          保持均衡健康的生活方式。每天早上7点起床，先喝500ml温水，然后进行15分钟的房间整理和简单拉伸，8点左右到达办公室。
        </p>
      </div>
      <div className="twin-title-item twin-title-M3 absolute bottom-32 left-[-80rem] z-20 max-w-[31.25rem]">
        <p className="text-xl/6 font-semibold">3 MONTHS</p>
        <div className="mt-5 text-base font-medium">
          Living State: Wakes up at 7 AM, starts with 10-minute posture assessment and weight recording,Performs 30 minutes of
          fasted cardio, mainly running (maintaining heart ...
          <ReportM03 />
        </div>
        <p className="mt-2 text-base font-medium">
          生活状态：早上7点起床，先进行10分钟姿势评估和体重记录，空腹进行30分钟有氧运动（主要是跑步，保持心率在140-160）
        </p>
      </div>
    </>
  );
}
