import { Drawer } from 'vaul';
import SwitchLanguage from '../SwitchLanguage';
import { useState } from 'react';
import Tag from './Tag';

export default function ReportM03() {
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
          <div className="flex h-full w-full grow flex-col p-4">
            <Drawer.Title className="flex items-center gap-3 text-xl/6 font-semibold">
              Fitness Fitness Fitness <SwitchLanguage isChineseActive={isChinese} onChange={handleLanguageChange} />
            </Drawer.Title>
            <Drawer.Close className="absolute right-4 top-4 w-5">
              <img src="/svgs/close.svg" alt="" />
            </Drawer.Close>
            <div className="mb-2 mt-4 flex items-center justify-between">
              <div className="flex-1 overflow-hidden">
                <div className="flex gap-2 whitespace-nowrap">
                  {['3 MONTHS', 'Structured fitness', 'Precision-Controlled'].map((tag, index) => (
                    <Tag key={tag} text={tag} isActive={index === 0} />
                  ))}
                </div>
              </div>
            </div>
            <Drawer.Description className="overflow-scroll">
              {isChinese ? (
                <div className="mt-5 text-base font-medium">
                  <h3 className="font-bold">生活状态：</h3>
                  <p>早上7点起床，先进行10分钟姿势评估和体重记录</p>
                  <p>空腹进行30分钟有氧运动（主要是跑步，保持心率在140-160）</p>
                  <p>9点到达工作地点，晚上6点下班后直接去健身房</p>
                  <p>
                    <span className="text-red-600">晚上11点左右入睡</span>
                  </p>
                  <p>
                    制定<span className="text-red-600">详细的每周饮食和训练计划</span>，严格执行
                  </p>
                  <p>每日记录体重、腰围、体脂率，并拍摄进度照片追踪身体变化</p>

                  <h3 className="mt-2 font-bold">饮食习惯：</h3>
                  <p>
                    <span className="text-red-600">严格控制每日总热量在1500-1800大卡</span>
                  </p>
                  <p>早餐：蛋白粉（30g乳清蛋白）、2片全麦面包、200g西兰花</p>
                  <p>午餐：200g鸡胸肉、100g糙米、200g生菜</p>
                  <p>加餐：能量棒（150大卡）或1个苹果</p>
                  <p>晚餐：150g三文鱼、100g藜麦、150g西兰花+150g胡萝卜</p>
                  <p>
                    <span className="text-red-600">严格限制碳水摄入低于150g，保持蛋白质摄入高于150g</span>
                  </p>
                  <p>
                    <span className="text-red-600">完全杜绝零食、饮料和油炸食品</span>
                  </p>
                  <p>精确称量每餐食材，确保营养摄入精准</p>

                  <h3 className="mt-2 font-bold">工作情况：</h3>
                  <p>利用午休时间在办公室健身房快走30分钟</p>
                  <p>
                    <span className="text-red-600">工作间隙进行1小时的静态运动</span>，包括15次深蹲和10次俯卧撑
                  </p>
                  <p>准备充足的饮用水和低热量代餐，以管理饥饿感</p>

                  <h3 className="mt-2 font-bold">心理状态：</h3>
                  <p>
                    开始<span className="text-red-600">控制饮食和强化健身</span>以实现减脂目标
                  </p>
                  <p>因饮食调整带来一定焦虑和压力</p>
                  <p>通过工作和娱乐分散注意力进行调节</p>
                  <p>每日拍摄健身进度照片，在社交媒体分享训练过程获得激励</p>
                  <p>观看健身网红视频保持动力</p>
                  <p>
                    <span className="text-red-600">加入减脂支持群</span>，进行每日打卡和交流
                  </p>

                  <h3 className="mt-2 font-bold">营养补充：</h3>
                  <p>左旋肉碱（Now，2000mg/天）</p>
                  <p>共轭亚油酸（Myogenix，4000mg/天）</p>
                  <p>BCAA（训练前后各5g）</p>
                  <p>乳清蛋白（MuscleTech，90g/天）</p>
                  <p>维生素D（2000IU/天）</p>
                  <p>复合维生素</p>

                  <h3 className="mt-2 font-bold">药物使用</h3>
                  <p>
                    每餐搭配<span className="text-red-600">消化酶补充剂</span>
                  </p>
                  <p>运动后肌肉酸痛时使用局部按摩凝胶</p>

                  <h3 className="mt-2 font-bold">训练习惯：</h3>
                  <p>购买了私教课程，教练制定详细训练计划并全程监督</p>
                  <p>晚上训练包含30分钟有氧+45分钟力量训练</p>
                  <p>训练后由教练进行肌肉放松</p>
                  <p>
                    <span className="text-red-600">每周训练6天，周日休息日保持1小时轻有氧</span>
                  </p>
                  <p>确保每日总运动时长不少于2小时</p>

                  <h3 className="mt-2 font-bold">环境适应：</h3>
                  <p>根据不同天气条件配备合适的训练服饰</p>
                  <p>
                    确保<span className="text-red-600">训练环境通风良好</span>
                  </p>
                  <p>家中备有瑜伽垫及基础训练设备，以便随时锻炼</p>
                  <p>
                    维持<span className="text-red-600">室内适宜的温湿度，定期通风</span>
                  </p>

                  <h3 className="mt-2 font-bold">社交互动：</h3>
                  <p>暂停不必要的社交聚餐</p>
                  <p>
                    保持<span className="text-red-600">每周1-2次社交活动</span>，主要为严格控制饮食的朋友聚餐
                  </p>
                  <p>与健身爱好者定期户外运动</p>
                  <p>向亲友解释减脂计划，争取支持</p>
                  <p>寻找训练搭档，相互监督</p>

                  <h3 className="mt-2 font-bold">睡眠质量：</h3>
                  <p>
                    确保<span className="text-red-600">每日7.5-8小时睡眠</span>
                  </p>
                  <p>睡前进行10分钟放松拉伸</p>
                  <p>通过Apple Watch监测睡眠质量</p>

                  <h3 className="mt-2 font-bold">恢复计划：</h3>
                  <p>每周接受专业按摩</p>
                  <p>每日使用泡沫轴进行肌肉按摩</p>
                  <p>适当使用冷热敷促进恢复</p>
                  <p>严格遵守训练和恢复日安排</p>
                </div>
              ) : (
                <div className="mt-5 text-base font-medium">
                  <h3 className="font-bold">Living State: </h3>
                  <p>Wakes up at 7 AM, starts with 10-minute posture assessment and weight recording</p>
                  <p>Performs 30 minutes of fasted cardio, mainly running (maintaining heart rate between 140-160)</p>
                  <p>Arrives at work at 9 AM, goes directly to gym after finishing work at 6 PM</p>
                  <p>
                    <span className="text-red-600">Sleeps around 11 PM</span>
                  </p>
                  <p>
                    Creates <span className="text-red-600">detailed weekly exercise and diet plans</span>, follows them strictly
                  </p>
                  <p>Records daily weight, waist circumference, body fat percentage</p>
                  <p>Takes progress photos to track physical changes</p>
                  <h3 className="mt-2 font-bold">Eating Habits:</h3>
                  <p>
                    <span className="text-red-600">Strictly controls total calories between 1500-1800</span>
                  </p>
                  <p>Breakfast: Protein powder (30g whey protein), 2 slices whole wheat bread, 200g broccoli</p>
                  <p>Lunch: 200g chicken breast, 100g brown rice, 200g lettuce</p>
                  <p>Snack: Energy bar (150 cal) or 1 apple</p>
                  <p>Dinner: 150g salmon, 100g quinoa, 150g each of broccoli and carrots</p>
                  <p>
                    Completely <span className="text-red-600">eliminates snacks, beverages, and fried foods</span>
                  </p>
                  <p>Weighs all ingredients precisely for each meal</p>

                  <h3 className="mt-2 font-bold">Work Situation:</h3>
                  <p>Uses lunch break for 30-minute fast walk in office gym</p>
                  <p>
                    Performs <span className="text-red-600">one hour of stationary exercise during work breaks,</span> including
                    15 squats and 10 push-ups
                  </p>
                  <p>Keeps adequate water and low-calorie meal replacements ready for hunger management</p>

                  <h3 className="mt-2 font-bold">Psychological State:</h3>
                  <p>
                    Started <span className="text-red-600">diet control and intensive fitness</span> for weight loss
                  </p>
                  <p>Experiences some anxiety and stress due to dietary adjustments</p>
                  <p>Manages through work and entertainment distractions</p>
                  <p>Takes daily progress photos, shares training process on social media for encouragement</p>
                  <p>Maintains motivation by watching fitness influencer videos</p>
                  <p>
                    <span className="text-red-600">Joins weight loss support groups</span> for daily check-ins and exchanges
                  </p>

                  <h3 className="mt-2 font-bold">Nutritional Intake:</h3>
                  <p>L-Carnitine (Now, 2000mg/day)</p>
                  <p>CLA (Myogenix, 4000mg/day)</p>
                  <p>BCAA (5g before and after exercise)</p>
                  <p>Whey protein (MuscleTech, 90g daily)</p>
                  <p>Vitamin D (2000IU/day)</p>
                  <p>Multivitamins</p>

                  <h3 className="mt-2 font-bold">Medication Intake:</h3>
                  <p>
                    Takes <span className="text-red-600">digestive enzyme supplements</span> with meals
                  </p>
                  <p>Uses gel for local massage when experiencing post-workout muscle soreness</p>

                  <h3 className="mt-2 font-bold">Exercise Habits:</h3>
                  <p>Purchased personal training sessions, trainer designs detailed plans and supervises training</p>
                  <p>Evening workouts include 30 minutes cardio and 45 minutes strength training</p>
                  <p>Follows with trainer-led muscle release</p>
                  <p>
                    <span className="text-red-600">
                      Trains 6 days per week, maintains 1 hour light cardio on Sunday rest day
                    </span>
                  </p>
                  <p>Ensures minimum 2 hours total daily exercise</p>

                  <h3 className="mt-2 font-bold">Environmental Exposure:</h3>
                  <p>Maintains adequate workout clothing for different weather conditions</p>
                  <p>
                    Ensures <span className="text-red-600">well-ventilated training environment</span>
                  </p>
                  <p>Keeps yoga mat and basic equipment at home for impromptu workouts</p>
                  <p>
                    Maintains
                    <span className="text-red-600"> appropriate temperature and humidity at home, frequently ventilates</span>
                  </p>

                  <h3 className="mt-2 font-bold">Social Interaction:</h3>
                  <p>Suspends unnecessary social dining</p>
                  <p>
                    Allows <span className="text-red-600">1-2 social activities weekly</span>, mainly dining with friends but
                    with strict dietary control
                  </p>
                  <p>Regular outdoor activities with fitness enthusiasts</p>
                  <p>Explains weight loss plan to friends and family for support</p>
                  <p>Seeks training partners for mutual supervision</p>

                  <h3 className="mt-2 font-bold">Sleep Quality:</h3>
                  <p>
                    Ensures <span className="text-red-600">7.5-8 hours of sleep nightly</span>
                  </p>
                  <p>Performs 10 minutes of relaxation stretches before bed</p>
                  <p>Uses Apple Watch to monitor sleep quality</p>

                  <h3 className="mt-2 font-bold">Recovery Plan:</h3>
                  <p>Weekly professional massage</p>
                  <p>Daily foam roller massage mandatory</p>
                  <p>Appropriate use of hot and cold compresses to promote recovery</p>
                  <p>Strictly follows training and recovery day schedules</p>
                </div>
              )}
            </Drawer.Description>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
