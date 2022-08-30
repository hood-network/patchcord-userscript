import { patchcordAPI } from '..';
import ItemWithButton from './ItemWithButton';
import Switch from './Switch';

export default () => {
  const React = patchcordAPI.common.React;
  return (
    <>
      <Switch
        title="Cumcord"
        description="Load Cumcord in Patchcord."
        setName="cumcord"
        onChange={async (v: boolean) => {
          if (v)
            (unsafeWindow as any).eval(
              await (
                await fetch('https://raw.githubusercontent.com/Cumcord/builds/main/build.js')
              ).text(),
            );
          else (unsafeWindow as any).cumcord.uninject();
        }}
      />
      <ItemWithButton
        title="my balls"
        description="are on fire"
        buttonText="wtf"
        callback={() => console.log('cock')}
      />
    </>
  );
};
