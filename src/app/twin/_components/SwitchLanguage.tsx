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
    <div className="relative h-6 w-11 cursor-pointer overflow-hidden rounded bg-white shadow-lg" onClick={handleClick}>
      <div
        className={clsx(
          'absolute left-0 flex h-full w-[55%] items-center justify-center text-sm/3.5 font-semibold [clip-path:polygon(0_0,80%_0,100%_100%,0_100%)]',
          isChinese ? 'bg-white text-gray-800' : 'bg-red-700 text-white',
        )}
      >
        A
      </div>

      <div
        className={clsx(
          'absolute right-0 z-10 flex h-full w-[55%] items-center justify-center text-sm/3.5 font-semibold [clip-path:polygon(0_0,100%_0,100%_100%,20%_100%)]',
          isChinese ? 'bg-red-700 text-white' : 'bg-white text-black',
        )}
      >
        文
      </div>
    </div>
  );
};

export default SwitchLanguage;
