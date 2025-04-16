'use client';

import React, { forwardRef } from 'react';

export const DraggableWrapper = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  (props, ref) => {
    return <div ref={ref} {...props} />;
  }
);

DraggableWrapper.displayName = 'DraggableWrapper';
