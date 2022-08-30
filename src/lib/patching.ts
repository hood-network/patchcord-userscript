import { patchcordAPI } from '..';

export function findAsync(filter, legacycompat = true) {
  let foundModule = filter();

  if (foundModule !== undefined) {
    foundModule = Promise.resolve(foundModule);

    if (legacycompat) {
      return foundModule;
    }

    return [foundModule, () => {}];
  }

  const patches = [];

  function unpatchAll() {
    for (const unpatch of patches) unpatch();
  }

  const modulePromise = new Promise((resolve) => {
    patches.push(
      patchcordAPI.spitroast.before('push', window.webpackChunkdiscord_app, ([[, modules]]) => {
        for (const moduleId in modules) {
          patches.push(
            patchcordAPI.spitroast.after(
              moduleId,
              modules,
              () => {
                if (foundModule !== undefined) return;

                foundModule = filter();
                if (foundModule !== undefined) {
                  unpatchAll();
                  resolve(foundModule);
                }
              },
              true,
            ),
          );
        }
      }),
    );
  });

  return legacycompat ? modulePromise : [modulePromise, unpatchAll];
}
export function findAndPatch(moduleFinder, patchCallback) {
  let cancelled = false;
  let unpatch;

  const [modPromise, webpackUnpatch] = findAsync(moduleFinder, false);

  modPromise.then((mod) => {
    if (!cancelled) unpatch = patchCallback(mod);
  });

  return () => {
    cancelled = true;
    webpackUnpatch?.();
    unpatch?.();
  };
}
