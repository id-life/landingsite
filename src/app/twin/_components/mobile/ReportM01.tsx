import { Drawer } from 'vaul';
import SwitchLanguage from '../SwitchLanguage';
import { useState } from 'react';
import Tag from './Tag';

export default function ReportM01() {
  const [isChinese, setIsChinese] = useState(false);

  const handleLanguageChange = (isChinese: boolean) => {
    setIsChinese(isChinese);
  };

  return (
    <Drawer.Root direction="bottom">
      <Drawer.Trigger className="text-red-600"> More &gt;</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[50] bg-black/40 backdrop-blur" />
        <Drawer.Content className="fixed bottom-0 left-0 top-[200px] z-[100] flex w-full bg-white outline-none">
          <div className="flex h-full w-full flex-1 grow flex-col overflow-y-auto p-4">
            <div className="flex-none">
              <Drawer.Title className="flex items-center gap-3 text-xl/6 font-semibold">
                Unhealthy habits me <SwitchLanguage isChineseActive={isChinese} onChange={handleLanguageChange} />
              </Drawer.Title>
              <Drawer.Close className="absolute right-4 top-4 w-5">
                <img src="/svgs/close.svg" alt="" />
              </Drawer.Close>
              <div className="mb-2 mt-4 flex items-center justify-between">
                <div className="flex-1 overflow-hidden">
                  <div className="flex flex-wrap gap-2">
                    {['30 YEARS', 'Sedentary', 'High-Sugar'].map((tag, index) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <Drawer.Description className="overflow-scroll">
              {isChinese ? (
                <div className="mt-5 text-base font-medium">
                  <h3 className="font-bold">生活状态：</h3>
                  每天早上11点起床，午饭后继续睡觉至下午2点才开始一天的活动。长期作息不规律，经常熬夜至凌晨3-4点，
                  <span className="text-red-600">几乎无法在一周内维持规律的睡眠时间。</span>
                  每天使用电子设备超过14小时，很少外出，基本全天待在家中，长期久坐不动。
                  <h3 className="mt-2 font-bold">饮食习惯：</h3>
                  <span className="text-red-600">不吃早餐，从不做饭，午餐和晚餐主要依赖外卖。</span>
                  喜欢高脂高糖食物，偏爱油炸食品。通常在凌晨1点后才吃晚餐，且食量较大。每周至少吃4次火锅或烧烤。
                  <span className="text-red-600">高糖饮料摄入量大，</span>
                  每天至少喝1.5升可乐，平均每天喝2杯奶茶。零食以辣条、薯片为主，日均摄入超过300克。
                  <span className="text-red-600">几乎不吃水果和蔬菜，</span> 主食主要是精制谷物。
                  <h3 className="mt-2 font-bold">工作情况：</h3>
                  <span className="text-red-600">全天在空调办公室工作，长时间盯着电脑屏幕。</span>
                  因起床晚，不午休。工作时习惯弓背、低头，不注意坐姿，喜欢翘腿。每20分钟吃一次零食。
                  <span className="text-red-600">工作效率低，经常感到疲劳，依赖能量饮料缓解。</span>
                  <h3 className="mt-2 font-bold">心理状态：</h3>
                  <span className="text-red-600">完全不关心</span>
                  体重和健康状况，有中度焦虑但从不处理，通过购物和深夜吃零食缓解压力。情绪
                  <span className="text-red-600">波动较大</span>，在兴奋和低落之间反复。
                  <h3 className="mt-2 font-bold">营养摄入：</h3>
                  完全<span className="text-red-600">不</span>服用维生素或任何营养补充剂。对营养知识
                  <span className="text-red-600">毫无了解</span>，认为正常吃饭就足够了。偶尔因精力不足服用兴奋剂。
                  <h3 className="mt-2 font-bold">药物摄入：</h3>
                  经常服用咖啡因片提神。
                  <h3 className="mt-2 font-bold">运动习惯：</h3>
                  除了步行到办公楼外，<span className="text-red-600">几乎没有任何运动。</span>
                  日均步数不超过2000步，上下楼都会搭电梯。<span className="text-red-600">每天久坐超过15小时。</span>
                  <h3 className="mt-2 font-bold">环境接触：</h3>
                  长期生活在<span className="text-red-600">封闭的空调环境</span>
                  中，很少开窗通风。下班后经常在黑暗环境中使用手机。居住环境<span className="text-red-600">潮湿但从不处理</span>
                  ，卧室无阳光，空气质量差。几乎不晒太阳，起床后马上进入空调房，长期缺乏户外活动。
                  <h3 className="mt-2 font-bold">社交情况：</h3>
                  主要依靠<span className="text-red-600">线上社交</span>
                  ，每天在社交媒体上花费超过6小时。线下社交活动每月不超过两次。与家人主要通过微信联系，极少见面。与朋友聚餐时，总是选择火锅或烧烤。偶尔在聚餐时喝酒。
                  <h3 className="mt-2 font-bold">睡眠质量：</h3>
                  <span className="text-red-600">作息极不规律</span>
                  ，经常凌晨入睡。睡前必须玩手机超过2小时。房间全黑，但会开着电视入睡。平均实际睡眠时间不足7小时。
                  <h3 className="mt-2 font-bold">个人卫生：</h3>
                  几乎不运动，<span className="text-red-600">除非出汗，否则不会每天洗澡。</span>
                  牙膏用完会拖很久才买新的，平均3天才刷一次牙。不做任何护肤，如洗脸或使用护肤品。
                  <h3 className="mt-2 font-bold">体检情况：</h3>
                  <span className="text-red-600">每2-3年才体检一次，</span>
                  很少主动做健康检查，对体检结果不上心。身体不适时，通常在网上查找解决方案。对医学和健康知识完全不感兴趣。
                </div>
              ) : (
                <div className="mt-5 text-base font-medium">
                  <h3 className="font-bold">Living State: </h3>
                  Gets up at 11 AM daily, continues sleeping after lunch until 2 PM before starting the day&apos;s activities.
                  Long-term irregular living patterns, often staying up until 3-4 AM,
                  <span className="text-red-600">rarely able to maintain a regular sleep schedule throughout the week.</span>
                  Uses electronic devices intensively for over 14 hours daily, rarely goes out, usually stays at home all day,
                  remaining sedentary.
                  <h3 className="mt-2 font-bold">Eating Habits: </h3>
                  <span className="text-red-600">
                    Skips breakfast, never cooks, relies mainly on takeout for lunch and dinner.
                  </span>
                  Prefers high-fat and high-sugar foods, enjoys fried foods. Often eats dinner after 1 AM with large portions.
                  Has hotpot or barbecue at least 4 times per week.
                  <span className="text-red-600">High consumption of sugary drinks</span>, at least 1.5L of cola daily and an
                  average of 2 bubble teas per day. Snacks mainly consist of spicy strips and chips, consuming over 300g daily
                  on average. <span className="text-red-600">Rarely eats fruits and vegetables,</span> mainly consumes refined
                  grains as staples.
                  <h3 className="mt-2 font-bold">Work Situation: </h3>
                  <span className="text-red-600">
                    Works all day in an air-conditioned office, job requires long hours of staring at computer screens.
                  </span>
                  Due to late wake-up time, doesn&apos;t take lunch breaks. Habitually slouches with hunched back and
                  forward-leaning neck while working, pays no attention to posture, likes to cross legs. Snacks every 20
                  minutes.
                  <span className="text-red-600">
                    Low work efficiency, frequently experiences fatigue, uses energy drinks for relief.
                  </span>
                  <h3 className="mt-2 font-bold">Psychological State: </h3>
                  <span className="text-red-600">Completely unconcerned</span> about weight and health conditions, has moderate
                  anxiety but never addresses it, relieves stress through shopping and late-night snacking. Experiences
                  <span className="text-red-600">significant mood swings</span>, alternating between excitement and depression.
                  <h3 className="mt-2 font-bold">Nutritional Intake: </h3>
                  Takes <span className="text-red-600">no</span> vitamins or nutritional supplements whatsoever. Has
                  <span className="text-red-600">no</span> understanding of nutritional knowledge, believes regular eating is
                  sufficient. Occasionally takes stimulants due to lack of energy.
                  <h3 className="mt-2 font-bold">Medication Intake: </h3>
                  Frequently takes caffeine pills for energy.
                  <h3 className="mt-2 font-bold">Exercise Habits: </h3>
                  Apart from walking to the office building,
                  <span className="text-red-600">performs virtually no form of exercise.</span> Average daily step count
                  doesn&apos;t exceed 2000 steps. Take the elevator even for just one floor.
                  <span className="text-red-600">Sit for an average of over 15 hours daily.</span>
                  <h3 className="mt-2 font-bold">Environmental Exposure: </h3>
                  Lives long-term in <span className="text-red-600">sealed, air-conditioned environments</span>, rarely opens
                  windows for ventilation. Often uses phone in dark environments after work. Living environment is
                  <span className="text-red-600">damp but never addressed</span>. Bedroom never receives sunlight, poor air
                  quality. Never gets sun exposure, stays in air-conditioned rooms right after waking up, long-term lack of
                  outdoor activities.
                  <h3 className="mt-2 font-bold">Social Interaction: </h3>
                  Primarily engages in <span className="text-red-600">online social interaction</span>, spending over 6 hours
                  daily on social media. Offline social activities occur no more than twice monthly. Communicates with family
                  mainly through WeChat, rarely meets in person. Always chooses hotpot or barbecue for friend gatherings.
                  Occasionally drinks alcohol when dining with friends.
                  <h3 className="mt-2 font-bold">Sleep Quality: </h3>
                  <span className="text-red-600">Irregular sleep schedule</span>, often goes to bed in early morning hours. Must
                  use phone for over 2 hours before sleeping. Room is completely dark, but falls asleep with TV on. Average
                  actual sleep time is less than 7 hours daily.
                  <h3 className="mt-2 font-bold">Personal Hygiene: </h3>
                  Almost never exercises or sweats. <span className="text-red-600">Do not shower every day unless sweats.</span>
                  Puts off buying new toothpaste for a long time when it runs out. Only brushes teeth about once every three
                  days. Doesn&apos;t do any skincare like washing face or using creams.
                  <h3 className="mt-2 font-bold">Medical Checkups: </h3>
                  Gets <span className="text-red-600">physical examination once every 2-3 years</span>, rarely initiates health
                  checkups, doesn&apos;t take physical examinations seriously. Usually searches online for solutions when
                  experiencing physical discomfort. Completely disinterested in medical and health care knowledge.
                </div>
              )}
            </Drawer.Description>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
