export default function MenuOpenSVG({ className }: { className?: string }) {
  return (
    <svg className={className} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle opacity="0.8" cx="20" cy="20" r="19.5" transform="rotate(-90 20 20)" stroke="var(--foreground)" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 15H27V17H13V15ZM13 19.3333H27V21.3333H13V19.3333ZM27 23.6667H13V25.6667H27V23.6667Z"
        fill="var(--foreground)"
      />
    </svg>
  );
}
