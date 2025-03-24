interface TagProps {
  isActive?: boolean;
  text: string;
  onClick?: () => void;
}

export default function Tag({ isActive = false, text, onClick }: TagProps) {
  return (
    <div
      onClick={onClick}
      className={`clip-path-[polygon(10px_0,_100%_0,_100%_100%,_0_100%,_0_10px)] relative inline-block cursor-pointer px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
        isActive ? 'bg-[#222] text-white' : 'bg-white text-[#222]'
      } before:clip-path-[polygon(10px_0,_100%_0,_100%_100%,_0_100%,_0_10px)] font-medium before:absolute before:inset-0 before:border before:border-[#222] before:content-['']`}
    >
      {text}
    </div>
  );
}
