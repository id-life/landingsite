interface TagProps {
  isActive?: boolean;
  text: string;
}

/** A report's tag: a label, not a control (no caller ever passed it a click). */
export default function Tag({ text }: TagProps) {
  return (
    <div
      className={`relative inline-block bg-tone-800/10 px-4 py-1.5 text-sm font-medium text-tone-800 transition-colors duration-200 [clip-path:polygon(8px_0,100%_0,100%_100%,0_100%,0_8px)]`}
    >
      {text}
    </div>
  );
}
