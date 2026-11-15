interface TagProps {
  isActive?: boolean;
  text: string;
  onClick?: () => void;
}

export default function Tag({ text, onClick }: TagProps) {
  return (
    <div
      onClick={onClick}
      className={`relative inline-block bg-tone-800/10 px-4 py-1.5 text-label font-medium text-tone-800 transition-colors duration-200 [clip-path:polygon(8px_0,100%_0,100%_100%,0_100%,0_8px)]`}
    >
      {text}
    </div>
  );
}
