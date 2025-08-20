import React, { memo } from 'react';

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
          '--corner-border-color': color || '#000',
          '--corner-border-size': size || '6px',
          '--corner-border-width': width || '2px',
          '--corner-border-hover-color': hoverColor || '#C11111',
        } as React.CSSProperties
      }
    >
      <span className="absolute inset-0 -z-10"></span>
    </div>
  );
}
CornerBorder.displayName = 'CornerBorder';
export default memo(CornerBorder);
