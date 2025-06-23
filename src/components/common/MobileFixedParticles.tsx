import React from 'react';

interface IProps {
  isOverlay?: boolean;
}

export default function MobileFixedParticles({ isOverlay = false }: IProps) {
  return (
    <>
      <div className="fixed-bottom fixed left-10 top-[calc(50%_+_16rem)] h-2 w-9 bg-foreground transition duration-300 mobile:bottom-[5.5rem] mobile:left-5 mobile:top-auto mobile:h-1 mobile:w-4.5" />
      <div className="fixed-bottom fixed right-10 top-[calc(50%_+_14rem)] aspect-square h-4 bg-foreground transition duration-300 mobile:bottom-[5.5rem] mobile:right-5 mobile:top-auto mobile:h-2" />
      {!isOverlay && (
        <div className="fixed-top fixed right-[13.5rem] top-[calc(50%_-_14rem)] aspect-square h-4 bg-foreground transition duration-300 mobile:right-[6.75rem] mobile:top-[5.5rem] mobile:h-2" />
      )}
    </>
  );
}
