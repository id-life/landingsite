import React from 'react';

export default function EnBtnSVG({ active }: { active?: boolean }) {
  return (
    <svg width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 4C0 1.79086 1.79086 0 4 0H17.3684L26.6316 24H4C1.79086 24 0 22.2091 0 20V4Z"
        fill={active ? '#C11111' : '#fff'}
      />
      <path
        d="M12.9473 15.138H9.05526L8.41126 17H6.35326L9.86726 7.214H12.1493L15.6633 17H13.5913L12.9473 15.138ZM12.4153 13.57L11.0013 9.482L9.58726 13.57H12.4153Z"
        fill={active ? '#fff' : '#222'}
      />
    </svg>
  );
}
