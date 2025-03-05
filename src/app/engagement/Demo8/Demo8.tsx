import { useEffect } from 'react';
import { Slider } from '@/app/engagement/Demo8/slider';

export default function Demo8() {
  useEffect(() => {
    new Slider();
  }, []);

  return (
    <div className="js-slider w-[67.5rem] h-[37.5rem]">
      <div className="js-slider__inner"></div>
    </div>
  );
}
