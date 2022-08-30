import MainUI from './components/MainUI';
import { registerSection, initUserSettings } from './lib/settings';

async function loadLibs() {
  // @ts-ignore
  const websmack = await import('https://esm.sh/@cumjar/websmack');
  const webpack = websmack.createApi(websmack.autoraid());
  // @ts-ignore
  const spitroast = await import('https://esm.sh/spitroast');

  return [webpack, spitroast];
}

export let patchcordAPI;
(async () => {
  const [webpack, spitroast] = await loadLibs();
  const ipatchcordAPI = {
    webpack,
    spitroast,
    common: {
      React: webpack.findByProps('createElement'),
      ReactDOM: webpack.findByProps('hydrate'),
    },
  };
  patchcordAPI = ipatchcordAPI;
  unsafeWindow.patchcordAPI = ipatchcordAPI;

  registerSection('modstoggler', 'Client Mods', MainUI);

  initUserSettings();
})();
