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
    // Never smaller than 24 x 44 px. Its original size on coarse pointers too: it clips its overflow, so a hit
    // area outside the box would not take taps.
    // A button (ENG-03): its two letters are its name, its state is pressed while Chinese is shown; a flex item in both
    // places it is drawn, so it draws as the div did (its two halves are spans, absolutely placed flex boxes as before).
    <button
      type="button"
      aria-pressed={isChinese}
      className="relative h-[max(1.5rem,24px)] w-[max(2.75rem,44px)] cursor-pointer overflow-hidden rounded bg-white shadow-lg"
      onClick={handleClick}
    >
      <span
        className={clsx(
          'absolute left-0 flex h-full w-[55%] items-center justify-center text-sm/3.5 font-semibold [clip-path:polygon(0_0,80%_0,100%_100%,0_100%)]',
          isChinese ? 'bg-white text-tone-800' : 'bg-accent-hover text-white',
        )}
      >
        A
      </span>

      <span
        className={clsx(
          'absolute right-0 z-10 flex h-full w-[55%] items-center justify-center text-sm/3.5 font-semibold [clip-path:polygon(0_0,100%_0,100%_100%,20%_100%)]',
          isChinese ? 'bg-accent-hover text-white' : 'bg-white text-black',
        )}
      >
        文
      </span>
    </button>
  );
};

export default SwitchLanguage;
