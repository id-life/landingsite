export default function ScrollDown() {
  return (
    <div className="flex-center absolute bottom-5 left-1/2 animate-scroll-down gap-2.5 rounded-xl bg-white/50 p-2 backdrop-blur-xl">
      <img className="h-11" src="/svgs/scroll-mouse.svg" alt="scroll-down" />
      <p className="text-xl/6 font-bold uppercase text-gray-800">SCROLL</p>
    </div>
  );
}
