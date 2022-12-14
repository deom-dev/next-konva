import { useEffect, useState } from 'react';
import { debounce } from '../lib/debounce';

interface WindowSize {
  width: number;
  height: number;
}

export const windowSizeHook = (
  initialSize: WindowSize = { width: 800, height: 600 },
): WindowSize => {
  const [size, setSize] = useState<WindowSize>(initialSize);

  useEffect(() => {
    const onChange = () => {
      const { innerWidth, innerHeight } = window;
      if (size.width !== innerWidth || size.height !== innerHeight) {
        setSize({ width: innerWidth, height: innerHeight });
      }
    };
    onChange();

    const onChangeDebounced = debounce(onChange, 500);
    window.addEventListener('resize', onChangeDebounced);
    return () => window.removeEventListener('resize', onChangeDebounced);
  });

  return size;
};
