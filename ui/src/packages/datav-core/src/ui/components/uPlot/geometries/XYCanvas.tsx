import { usePlotContext } from '../context';
import React, { useMemo } from 'react';
import { css } from '@emotion/css';

interface XYCanvasProps {}

/**
 * Renders absolutely positioned element on top of the uPlot's plotting area (axes are not included!).
 * Useful when you want to render some overlay with canvas-independent elements on top of the plot.
 */
export const XYCanvas: React.FC<XYCanvasProps> = ({ children }) => {
  const plotCtx = usePlotContext();
  const plotInstance = plotCtx.plot;

  const className = useMemo(() => {
    return css`
      position: absolute;
      overflow: visible;
      left: ${plotInstance.bbox.left / window.devicePixelRatio}px;
      top: ${plotInstance.bbox.top / window.devicePixelRatio}px;
    `;
  }, [plotInstance.bbox.left, plotInstance.bbox.top]);
  
  if (!plotInstance) {
    return null;
  }



  return <div className={className}>{children}</div>;
};
