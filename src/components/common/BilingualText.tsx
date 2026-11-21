/**
 * A bilingual label such as 'mission 使命' with its Chinese part marked lang="zh-Hans" (VIS-07), so screen readers
 * switch voice and the :lang(zh) rules in globals.css (CJK spacing, no Latin letter-spacing) apply to it alone.
 * Text without a trailing Chinese part renders unchanged.
 */
export default function BilingualText({ text }: { text: string }) {
  const m = /^(.*?)(\s*)([　-〿㐀-鿿＀-￯]+)\s*$/u.exec(text);
  if (!m) return text;
  return (
    <>
      {m[1]}
      {m[2]}
      <span lang="zh-Hans" className="zh-run">
        {m[3]}
      </span>
    </>
  );
}
