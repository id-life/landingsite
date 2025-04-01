import { Drawer } from 'vaul';
import SwitchLanguage from './SwitchLanguage';
import { useState } from 'react';

export default function ReportM02() {
  const [isChinese, setIsChinese] = useState(false);

  const handleLanguageChange = (isChinese: boolean) => {
    setIsChinese(isChinese);
  };

  return (
    <Drawer.Root direction="left">
      <Drawer.Trigger className="text-red-600"> More &gt;</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[50] bg-black/40 backdrop-blur" />
        <Drawer.Content className="fixed bottom-0 left-0 top-0 z-[100] flex w-[42rem] bg-white outline-none">
          <div className="flex h-full w-full grow flex-col p-10">
            <Drawer.Title className="text-[2.5rem]/[3rem] font-semibold">A Healthier Life</Drawer.Title>
            <Drawer.Close className="absolute right-10 top-10 w-5">
              <img src="/svgs/close.svg" alt="" />
            </Drawer.Close>
            <div className="mb-2 mt-4 flex items-center justify-between">
              <div className="flex items-center justify-center gap-0.5 bg-red-600/20 p-1 text-xl/5 font-semibold uppercase text-red-600">
                <img src="/svgs/twin/time.svg" alt="" />5 YEARS
              </div>
              <SwitchLanguage isChineseActive={isChinese} onChange={handleLanguageChange} />
            </div>
            <Drawer.Description className="overflow-scroll">
              {isChinese ? (
                <div className="mt-5 text-base font-medium">
                  <div>
                    <span className="font-bold">保持均衡健康的生活方式</span>
                    。每天早上7点起床，先喝500ml温水，然后进行15分钟的房间整理和简单拉伸，8点左右到达办公室。
                  </div>
                  <div className="mt-2">
                    <span className="font-bold">采用科学的营养摄入方式，将三餐按4:3:3比例分配</span>
                    ，强调<span className="text-red-600">低碳水</span>和<span className="text-red-600">高蛋白均衡营养</span>
                    。早餐为自制燕麦杯（50g燕麦+15g奇亚籽+50g蓝莓）搭配蒸蛋。提前一周规划午餐，带饭上班，主食包含红薯、玉米等全谷物（50%），配2-3种时令蔬菜。晚餐以
                    <span className="text-red-600">蛋白质为主</span>
                    ，主要食用鱼类和海鲜，严格控制精制糖摄入，饮品以水和自制果蔬汁为主。
                  </div>
                  <div className="mt-2">
                    <span className="font-bold">工作强度适中，每天6-8小时，环境相对灵活</span>
                    。为确保符合人体工学，<span className="text-red-600">保持桌面与手肘高度一致，每小时进行5分钟护眼休息</span>
                    。午休时听20分钟冥想音频，办公桌摆放多肉植物以提升心情。设定喝水提醒，避免长时间久坐。
                  </div>

                  <div className="mt-2">
                    <span className="font-bold"> 保持积极心态，压力水平较低</span>。
                    <span className="text-red-600">通过分享</span>
                    生活感悟、电影和音乐评论来表达情绪。营养补充方面，早餐后服用B族维生素（Thorne），午餐后服用姜黄素（Now,
                    300mg），晚餐前服用螺旋藻（6片），睡前服用益生菌（500亿CFU），并
                    <span className="text-red-600">每3个月根据血检调整补充方案</span>。
                  </div>
                  <div className="mt-2">
                    <span className="font-bold">坚持多样化的运动习惯</span>
                    ，包括<span className="text-red-600">每日1小时健身房训练</span>
                    （核心力量训练），每周两次游泳课，保持日均8000步。周末与朋友徒步或骑行，并练习低强度太极拳，
                    <span className="text-red-600">展现对传统运动形式的兴趣</span>。
                  </div>
                  <div className="mt-2">
                    <span className="font-bold">选择自然通风良好的办公环境，靠近公园</span> ，确保
                    <span className="text-red-600">每天1小时的日晒时间</span>
                    。积极社交，常回家陪伴家人共餐，并参与本地环保志愿活动。与邻居组成屋顶花园兴趣小组。
                  </div>
                  <div className="mt-2">
                    <span className="font-bold">建立完善的个人生活管理系统，合理安排作息</span>
                    。保持<span className="text-red-600">规律作息</span>
                    ，晚上23:00前入睡，睡前泡脚按摩15分钟。定期阅读营养和健康管理书籍，并结合节气调整作息与饮食，体现现代健康理念与传统养生智慧的融合。
                  </div>
                </div>
              ) : (
                <div className="mt-5 text-base font-medium">
                  <div>
                    <span className="font-bold">Maintains a balanced and healthy lifestyle</span>. Starts the day at 7 AM with
                    500ml of warm water, followed by 15 minutes of room tidying and simple stretches before arriving at the
                    office around 8 AM.
                  </div>
                  <div className="mt-2">
                    <span className="font-bold">
                      Adopts a scientific nutritional approach by distributing three meals in a 4:3:3 ratio
                    </span>
                    , emphasizing <span className="text-red-600">low-carb</span> and
                    <span className="text-red-600">high-protein balanced nutrition</span>. Breakfast consists of a homemade
                    oatmeal cup (50g oats + 15g chia seeds + 50g blueberries) with steamed eggs. Plans lunch a week ahead,
                    bringing packed meals to work that include whole grains like sweet potato and corn (50%) along with 2-3
                    seasonal vegetables. Focuses on <span className="text-red-600">protein for dinner</span>, mainly fish and
                    seafood, while strictly controlling refined sugar intake and primarily drinking water and homemade
                    fruit/vegetable juices.
                  </div>
                  <div className="mt-2">
                    <span className="font-bold">
                      Works in a relatively flexible environment with moderate intensity, 6-8 hours daily
                    </span>
                    . To ensure proper ergonomics, maintains optimal workspace conditions by
                    <span className="text-red-600">keeping desk at elbow height and taking 5-minute eye breaks every hour</span>
                    . During lunch breaks, listens to meditation audio for 20 minutes and keeps succulent plants at workstation
                    to improve mood. Sets water drinking reminders to avoid prolonged sitting.
                  </div>

                  <div className="mt-2">
                    <span className="font-bold">Maintains a positive mindset with low stress levels</span>.
                    <span className="text-red-600">Expresses emotions through sharing</span> life experiences, movie reviews,
                    and music reviews on social media. For nutritional support, takes B-complex vitamins (Thorne, after
                    breakfast), turmeric (Now, 300mg after lunch), spirulina (6 tablets before dinner), probiotics (50 billion
                    CFU before bed),
                    <span className="text-red-600">adjusting supplement plan every 3 months based on blood tests.</span>
                  </div>
                  <div className="mt-2">
                    <span className="font-bold">Follows a diverse and consistent exercise routine</span>, including
                    <span className="text-red-600">daily 1-hour gym sessions</span> focusing on core strength training, swimming
                    lessons twice weekly, and maintaining 8000 daily steps. Goes hiking or cycling with friends on weekends and
                    practices low-intensity Tai Chi,
                    <span className="text-red-600">demonstrating appreciation for traditional exercise forms.</span>
                  </div>
                  <div className="mt-2">
                    <span className="font-bold">Chooses a naturally well-ventilated office near a park</span>, ensuring
                    <span className="text-red-600">1 hour of daily sunlight exposure.</span> Actively engages in social
                    interactions, frequently returning home for family meals and participating in local environmental volunteer
                    activities. Has formed a rooftop garden interest group with neighbors.
                  </div>
                  <div className="mt-2">
                    <span className="font-bold">
                      Established a comprehensive personal life management system with reasonable work-rest allocation
                    </span>
                    . Maintains <span className="text-red-600">regular sleep schedule</span>, going to bed before 23:00 after
                    spending 15 minutes on foot soaking and massage. Regularly reads nutrition and health management books and
                    adjusts routine and diet according to solar terms, showing thoughtful integration of modern health concepts
                    with traditional wellness wisdom.
                  </div>
                </div>
              )}
            </Drawer.Description>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
