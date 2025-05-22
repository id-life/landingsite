import { Drawer } from 'vaul';
import SwitchLanguage from '../SwitchLanguage';
import { useState } from 'react';
import Tag from './Tag';
import { GA_EVENT_NAMES, GA_EVENT_LABELS } from '@/constants/ga';
import { useGA } from '@/hooks/useGA';

export default function ReportM02() {
  const [isChinese, setIsChinese] = useState(false);

  const { trackEvent } = useGA();

  const handleClick = () => {
    trackEvent({
      name: GA_EVENT_NAMES.TWIN_DESCRIPTION,
      label: GA_EVENT_LABELS.TWIN_DESCRIPTION.C02,
    });
  };

  const handleLanguageChange = (isChinese: boolean) => {
    setIsChinese(isChinese);
  };

  return (
    <Drawer.Root direction="bottom" disablePreventScroll={true}>
      <Drawer.Trigger className="text-xs/3 font-semibold text-red-600" onClick={handleClick}>
        {' '}
        More &gt;
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[50] bg-black/40 backdrop-blur" />
        <Drawer.Content className="fixed bottom-0 left-0 top-[200px] z-[100] flex w-full bg-white outline-none">
          <div className="flex h-full w-full grow flex-col p-4">
            <Drawer.Title className="flex items-center gap-3 text-xl/6 font-semibold">
              A Healthier Life <SwitchLanguage isChineseActive={isChinese} onChange={handleLanguageChange} />
            </Drawer.Title>
            <Drawer.Close className="absolute right-4 top-4 w-5">
              <img src="/svgs/close.svg" alt="" />
            </Drawer.Close>
            <div className="mb-2 mt-4 flex items-center justify-between">
              <div className="flex-1 overflow-hidden">
                <div className="flex flex-wrap gap-2">
                  {['5 Years', 'Disciplined Wellness', 'Balanced Nutrition'].map((tag, index) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
              </div>
            </div>
            <div className="overflow-scroll">
              {isChinese ? (
                <div className="mt-5 text-base font-medium">
                  <div>
                    <span className="font-bold">保持均衡健康的生活方式</span>
                    。每天早上7点起床，先喝500ml温水，然后进行15分钟的房间整理和简单拉伸，8点左右到达办公室。
                  </div>
                  <div className="mt-2">
                    <span className="font-bold">采用科学的营养摄入方式，将三餐按4:3:3比例分配</span>
                    ，强调<span className="text-red-600">低碳水</span>和<span className="text-red-600">高蛋白均衡营养</span>,
                    确保每天摄入1.6-2.2克蛋白质每公斤体重来维持肌肉。早餐为自制燕麦杯（50g燕麦+15g奇亚籽+50g蓝莓）搭配蒸蛋。提前一周规划午餐，带饭上班，主食包含红薯、玉米等全谷物（50%），配2-3种时令蔬菜。晚餐以
                    <span className="text-red-600">蛋白质为主</span>
                    ，主要食用鱼类和海鲜，在每次锻炼前后摄入碳水化合物帮助提供能量和恢复。每天至少饮用2-3升水保持水分充足。
                  </div>
                  <div className="mt-2">
                    <span className="font-bold">工作强度适中，每天6-8小时，环境相对灵活</span>
                    。为确保符合人体工学，<span className="text-red-600">保持桌面与手肘高度一致，每小时进行5分钟护眼休息</span>
                    。午休时听20分钟冥想音频，办公桌摆放多肉植物以提升心情。
                  </div>

                  <div className="mt-2">
                    <span className="font-bold"> 保持积极心态，压力水平较低</span>。
                    <span className="text-red-600">通过分享</span>
                    生活感悟、电影和音乐评论来表达情绪。为了营养支持，服用B族维生素（Thorne, 早餐后）、姜黄（Now,
                    午餐后300mg）、螺旋藻（餐前6片）、益生菌（睡前50亿CFU）。使用BCAA、肌酸、鱼油等补充剂帮助肌肉增长 。
                    <span className="text-red-600">每3个月根据血液检查调整补充剂计划</span>。
                  </div>
                  <div className="mt-2">
                    <span className="font-bold">坚持多样化的运动习惯</span>
                    ，每周进行4-6次<span className="text-red-600">力量训练</span>
                    ，采用“推-拉-腿”分组训练，确保全身肌肉得到锻炼。同时每周进行2-3次有氧运动，每次30-45分钟。每周至少进行
                    <span className="text-red-600">2次核心训练</span>。
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
                    <span className="font-bold">Balanced and healthy lifestyle</span>. Starts the day at 7 AM with 500ml of warm
                    water, followed by 15 minutes of room tidying and simple stretches before arriving at the office around 8
                    AM.
                  </div>
                  <div className="mt-2">
                    <span className="font-bold">Adopting a scientific 4:3:3 meal prep ratio</span>, emphasizing&nbsp;
                    <span className="text-red-600">low-carb</span> and&nbsp;
                    <span className="text-red-600">high-protein balanced nutrition</span>, ensuring an intake of 1.6-2.2 grams
                    of protein per kilogram of body weight daily to maintain muscle. Breakfast consists of a homemade oatmeal
                    cup paired with steamed eggs. Lunch is staples including whole grains like sweet potatoes and corn (50%),
                    accompanied by 2-3 seasonal vegetables. Dinner focuses on <span className="text-red-600">protein</span>,
                    primarily consisting of fish and seafood, while carbohydrates are consumed before and after workouts to help
                    provide energy and recovery. Drink at least 2-3 liters of water daily to stay hydrated.
                  </div>
                  <div className="mt-2">
                    <span className="font-bold">
                      Works in a relatively flexible environment with moderate intensity, 6-8 hours daily
                    </span>
                    . To ensure proper ergonomics, maintain optimal workspace conditions by&nbsp;
                    <span className="text-red-600">keeping desk at elbow height and taking 5-minute eye breaks every hour</span>
                    . Having 20mins of meditation audio during lunch break and placing succulent plants at work desk for mood
                    control.
                  </div>

                  <div className="mt-2">
                    <span className="font-bold">Maintains a positive mindset with low stress levels</span>.&nbsp;
                    <span className="text-red-600">Expresses emotions through sharing</span> life experiences, movie reviews,
                    and music reviews on social media. For nutritional support, takes B-complex vitamins (Thorne, after
                    breakfast), turmeric (Now, 300mg after lunch), spirulina (6 tablets before dinner), probiotics (50 billion
                    CFU before bed). Use supplements like BCAA, creatine, and fish oil to aid muscle growth.&nbsp;
                    <span className="text-red-600">Adjusting supplement plan every 3 months based on blood work.</span>
                  </div>
                  <div className="mt-2">
                    <span className="font-bold">Maintain a diverse exercise routine</span>, including&nbsp;
                    <span className="text-red-600">strength training 4-6 times</span> a week with a “push-pull-legs” split to
                    ensure all muscle groups are targeted. At the same time, engage in aerobic exercise 2-3 times a week,
                    lasting 30-45 minutes each session. Additionally, perform&nbsp;
                    <span className="text-red-600">core training at least 2 times</span> a week.
                  </div>
                  <div className="mt-2">
                    <span className="font-bold">Chooses a naturally well-ventilated office near a park</span>, ensuring&nbsp;
                    <span className="text-red-600">1 hour of daily sunlight exposure.</span> Active in social interactions,
                    family nights and volunteer activities. Good neighborhood relationship with occasional interest-sharing
                    session.
                  </div>
                  <div className="mt-2">
                    <span className="font-bold">
                      Established a comprehensive personal life routine with reasonable work-life balance
                    </span>
                    . Maintains <span className="text-red-600">regular sleep schedule</span>, going to bed before 23:00 after
                    spending 15 minutes on foot soaking and massage. Regularly reads nutrition and health management books and
                    adjusts routine and diet according to solar terms, showing thoughtful integration of modern health concepts
                    with traditional wellness wisdom.
                  </div>
                </div>
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
