/** Exporting the module like this to be able to generate docs properly. */
import * as colorManipulator from './colorManipulator';

export { createTheme } from './createTheme';
export * from './types';
export type { ThemeColors } from './createColors';
export type { ThemeBreakpoints, ThemeBreakpointsKey } from './breakpoints';
export type { ThemeShadows } from './createShadows';
export type { ThemeShape } from './createShape';
export type { ThemeTypography, ThemeTypographyVariant } from './createTypography';
export type { ThemeTransitions } from './createTransitions';
export type { ThemeSpacing } from './createSpacing';
export type { ThemeZIndices } from './zIndex';
export type{ ThemeVisualizationColors, ThemeVizColor, ThemeVizHue } from './createVisualizationColors';

export { colorManipulator };
