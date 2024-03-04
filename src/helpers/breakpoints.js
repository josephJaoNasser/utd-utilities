export const breakpoints = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

export function checkBreakpoint(width) {
  if (width < breakpoints.sm) return "xs";
  if (width >= breakpoints.sm < breakpoints.md) return "sm";
  if (width >= breakpoints.md < breakpoints.lg) return "md";
  if (width >= breakpoints.lg < breakpoints.xl) return "lg";
  if (width >= breakpoints.xl < breakpoints.xxl) return "xl";
  if (width >= breakpoints.xxl) return "xxl";
}
