import { ReactNode } from 'react';
import FixedUIContainer from './FixedUIContainer';

export default function OverlayContainer({ children, particleBg }: { children: ReactNode; particleBg?: ReactNode }) {
  return (
    <div className="base-background1 h-full w-full">
      <FixedUIContainer showNavLinks={false} />
      {particleBg}
      {children}
    </div>
  );
}
