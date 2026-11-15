import clsx from 'clsx';
import React, { useState, useEffect } from 'react';

type LanguageSwitcherProps = {
  isChineseActive: boolean;
  onChange: (isChinese: boolean) => void;
};

const SwitchLanguage = ({ isChineseActive, onChange }: LanguageSwitcherProps) => {
  const [isChinese, setIsChinese] = useState(isChineseActive);

  useEffect(() => {
    setIsChinese(isChineseActive);
  }, [isChineseActive]);

  const handleClick = () => {
    const newState = !isChinese;
    setIsChinese(newState);

    if (onChange) {
      onChange(newState);
    }
  };

  return (
    // Never smaller than 24 x 44 px (RWD-01); 44 px tall on coarse pointers (RWD-06: overflow-hidden would clip a hit area).
    <div
      className="relative h-[max(1.5rem,24px)] w-[max(2.75rem,44px)] cursor-pointer overflow-hidden rounded bg-white shadow-lg coarse:h-11"
      onClick={handleClick}
    >
      <div
        className={clsx(
          'absolute left-0 flex h-full w-[55%] items-center justify-center text-label font-semibold leading-[14px] [clip-path:polygon(0_0,80%_0,100%_100%,0_100%)]',
          isChinese ? 'bg-white text-tone-800' : 'bg-accent-hover text-white',
        )}
      >
        A
      </div>

      <div
        className={clsx(
          'absolute right-0 z-10 flex h-full w-[55%] items-center justify-center text-label font-semibold leading-[14px] [clip-path:polygon(0_0,100%_0,100%_100%,20%_100%)]',
          isChinese ? 'bg-accent-hover text-white' : 'bg-white text-black',
        )}
      >
        文
      </div>
    </div>
  );
};

export default SwitchLanguage;
