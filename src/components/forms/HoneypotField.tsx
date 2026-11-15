import { forwardRef, InputHTMLAttributes } from 'react';

/**
 * The newsletter forms' honeypot (ENG-09): an off-screen field people never see or reach (hidden from assistive
 * technology, out of the tab order). Form-filling bots fill it, and POST /api/subscribe silently drops any request
 * where it is not empty.
 */
const HoneypotField = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function HoneypotField(props, ref) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
      <label>
        Website
        <input ref={ref} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" {...props} />
      </label>
    </div>
  );
});

export default HoneypotField;
