import { cn } from '@/utils';
import { AnimatePresence, motion } from 'motion/react';
import React, { useCallback } from 'react';
import { BookSVG } from '../svg';

export interface PopupItem {
  name?: string;
  logo: string;
  desc?: string;
  linkDesc?: string;
  link?: string;
  className?: string;
}

export interface EngagementPopupProps {
  isOpen: boolean;
  title: string;
  items: PopupItem[];
  className?: string;
}

export const EngagementPopup: React.FC<EngagementPopupProps> = ({ isOpen, title, items, className }) => {
  // 捕获点击事件，阻止冒泡到父组件
  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'corner-button absolute bottom-full left-0 mb-6 flex w-[18.75rem] transform flex-col bg-white/[0.04] px-5 py-6 font-oxanium text-white backdrop-blur',
            className,
          )}
          onClick={handleContentClick}
        >
          <span className="absolute inset-0 -z-10"></span>
          <h3 className="text-2xl/6 font-semibold uppercase">{title}</h3>
          <div className="mt-7.5 flex grow flex-col items-start gap-5 overflow-auto">
            {items.map((item, idx) =>
              item.desc ? (
                // 如果有描述，渲染书籍卡片布局（用于Translation）
                <div key={idx} className="flex gap-3">
                  <img src={item.logo} alt={item?.name ?? ''} className="h-auto w-14 object-contain" />
                  <div className="flex flex-col justify-between">
                    <div>
                      <h4 className="text-base/5 font-semibold">{item.name}</h4>
                      {/* <p className="line-clamp-2 text-xs/5">{item.desc}</p> */}
                    </div>
                    {item.link && item.linkDesc && (
                      <a
                        href={item.link}
                        className="text-blue pointer-events-auto flex items-center gap-1.5 text-xs/5"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <BookSVG />
                        {item.linkDesc}
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                // 原有的简单图片渲染（用于Sponsorship）
                <img
                  key={idx}
                  src={item.logo}
                  alt={item?.name ?? ''}
                  className={cn('h-full w-auto object-contain', item?.className)}
                />
              ),
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
