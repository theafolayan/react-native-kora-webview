declare module 'react' {
  namespace React {
    type ReactNode = any;
  }
  export function useMemo(fn: () => any, deps: readonly any[]): any;
  const React: {
    useMemo: typeof useMemo;
  } & Record<string, any>;
  export default React;
}
