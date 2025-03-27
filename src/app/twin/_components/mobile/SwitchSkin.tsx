import { ModelType } from '@/components/twin/model/type';
import SkinSVG from '@/../public/svgs/twin/skin.svg?component';
import AnatomySVG from '@/../public/svgs/twin/anatomy.svg?component';
import { useAtom, useAtomValue } from 'jotai';
import { currentModelAtom, currentModelTypeAtom } from '@/atoms/twin';
import clsx from 'clsx';

export default function SwitchSkin() {
  const [currentModelType, setCurrentModelType] = useAtom(currentModelTypeAtom);
  const currentModel = useAtomValue(currentModelAtom);

  const handleModelTypeChange = (type: ModelType) => {
    setCurrentModelType(type);
  };

  return (
    <div id="switch-skin" className="absolute right-5 top-1/2 z-20 grid -translate-y-1/2 gap-5">
      <div className="grid grid-rows-2 gap-3">
        <div className="cursor-pointer" onClick={() => handleModelTypeChange(ModelType.Skin)}>
          <SkinSVG
            className={clsx(
              'w-7',
              currentModelType === ModelType.Skin ? 'fill-red-600 stroke-red-600' : 'fill-black stroke-black',
            )}
          />
        </div>
        <div className="cursor-pointer" onClick={() => handleModelTypeChange(ModelType.Anatomy)}>
          <AnatomySVG
            className={clsx(
              'w-7',
              currentModelType === ModelType.Anatomy ? 'fill-red-600 stroke-red-600' : 'fill-black stroke-black',
            )}
          />
        </div>
      </div>
    </div>
  );
}
