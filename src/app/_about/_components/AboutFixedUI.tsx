import VisionDecorationCircleSVG from '@/../public/svgs/vision/vision-decoration-3.svg?component';

export default function AboutFixedUI() {
  return (
    <>
      <div className="fixed left-10 top-[9.25rem] h-2 w-6 bg-foreground transition duration-300 mobile:left-5 mobile:top-[5.5rem] mobile:h-1 mobile:w-3" />
      <div className="fixed right-[13.5rem] top-[9.25rem] aspect-square h-4 bg-foreground transition duration-300 mobile:right-[6.75rem] mobile:top-[5.5rem] mobile:h-2" />
      <VisionDecorationCircleSVG className="fixed right-10 top-[9.25rem] h-4 w-4 fill-foreground stroke-foreground transition duration-300 mobile:right-5 mobile:top-[5.5rem] mobile:h-2 mobile:w-2" />
      <div className="fixed bottom-[9.25rem] left-10 h-2 w-9 bg-foreground transition duration-300 mobile:bottom-[5.5rem] mobile:left-5 mobile:top-auto mobile:h-1 mobile:w-4.5" />
      <div className="fixed bottom-[9.25rem] right-10 aspect-square h-4 bg-foreground transition duration-300 mobile:bottom-[5.5rem] mobile:right-5 mobile:top-auto mobile:h-2" />
    </>
  );
}
