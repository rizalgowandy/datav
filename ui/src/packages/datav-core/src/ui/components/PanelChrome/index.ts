import React from 'react';
import { LoadingIndicator } from './LoadingIndicator';
import { ErrorIndicator } from './ErrorIndicator';
import { PanelChrome as PanelChromeComponent, PanelChromeProps } from './PanelChrome';

/**
 * @internal
 */
export type { PanelChromeProps, PanelPadding } from './PanelChrome';

/**
 * @internal
 */
export interface PanelChromeType extends React.FC<PanelChromeProps> {
  LoadingIndicator: typeof LoadingIndicator;
  ErrorIndicator: typeof ErrorIndicator;
}

/**
 * @internal
 */
export const PanelChrome = PanelChromeComponent as PanelChromeType;
PanelChrome.LoadingIndicator = LoadingIndicator;
PanelChrome.ErrorIndicator = ErrorIndicator;

/**
 * Exporting the components for extensibility and since it is a good practice
 * according to the api-extractor.
 */
export {
  LoadingIndicator as PanelChromeLoadingIndicator,
} from './LoadingIndicator';
export type {
  LoadingIndicatorProps as PanelChromeLoadingIndicatorProps,
} from './LoadingIndicator';

export {
  ErrorIndicator as PanelChromeErrorIndicator,
} from './ErrorIndicator';
export type {
  ErrorIndicatorProps as PanelChromeErrorIndicatorProps,
} from './ErrorIndicator';

export { usePanelContext, PanelContextProvider, PanelContextRoot } from './PanelContext';
export type {PanelContext} from './PanelContext'

export * from './types';
