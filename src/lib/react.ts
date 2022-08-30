import { patchcordAPI } from '..';

export function useForceUpdate() {
  const React = patchcordAPI.common.React;
  const [value, setValue] = React.useState(false);
  return () => setValue();
}
