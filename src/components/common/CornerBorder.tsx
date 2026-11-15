import React, { memo } from 'react';

import { color as colorToken } from '@/styles/tokens';

function CornerBorder({
  color,
  size,
  width,
  hoverColor,
}: {
  color?: string;
  size?: string;
  width?: string;
  hoverColor?: string;
}) {
  return (
    <div
      className="corner-button absolute inset-0"
      style={
        {
          '--corner-border-color': color || '#666',
          '--corner-border-size': size || '6px',
          '--corner-border-width': width || '2px',
          '--corner-border-hover-color': hoverColor || colorToken.accent,
        } as React.CSSProperties
      }
    >
      <span className="absolute inset-0 -z-10"></span>
    </div>
  );
}
CornerBorder.displayName = 'CornerBorder';
export default memo(CornerBorder);
