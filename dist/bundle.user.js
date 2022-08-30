// ==UserScript==
// @name        PCML
// @description The Pathcord client mod loader
// @namespace   npmjs.com/rollup-plugin-userscript-metablock
// @author      Alyxia Sother
// @run-at      document-start
// @include     https://patchcord.pw/*
// @match       https://patchcord.pw/*
// @grant       unsafeWindow
// ==/UserScript==
var rollupUserScript = (function (exports) {
    'use strict';

    const getElements = () => {
        const Button = exports.patchcordAPI.webpack.findByProps('Sizes', 'Colors', 'Looks', 'DropdownSizes');
        const Markdown = exports.patchcordAPI.webpack.find((x) => x.displayName === 'Markdown' && x.rules);
        const FormItem = exports.patchcordAPI.webpack.findByDisplayName('FormItem');
        const FormText = exports.patchcordAPI.webpack.findByDisplayName('FormText');
        const Flex = exports.patchcordAPI.webpack.findByDisplayName('Flex');
        const Margins = exports.patchcordAPI.webpack.findByProps('marginTop20', 'marginBottom20');
        const FormClasses = exports.patchcordAPI.webpack.findByProps('title', 'dividerDefault');
        const FormTextClasses = exports.patchcordAPI.webpack.findByProps('formText', 'placeholder');
        const SwitchItem = exports.patchcordAPI.webpack.findByDisplayName('SwitchItem');
        return {
            Button,
            Markdown,
            SwitchItem,
            FormItem,
            FormText,
            Flex,
            Margins,
            FormClasses,
            FormTextClasses,
        };
    };

    var ItemWithButton = ({ title, description, buttonText, callback }) => {
        const React = exports.patchcordAPI.common.React;
        const { FormItem, Flex, Margins, FormClasses, FormTextClasses, FormText, Markdown, Button } = getElements();
        return (React.createElement(FormItem, { className: [
                Flex.Direction.VERTICAL,
                Flex.Justify.START,
                Flex.Align.STRETCH,
                Flex.Wrap.NO_WRAP,
                Margins.marginBottom20,
            ].join(' ') },
            React.createElement("div", { style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                } },
                React.createElement("div", null,
                    React.createElement("div", { className: FormClasses.labelRow, style: { marginBottom: '4px' } },
                        React.createElement("label", { className: FormClasses.title }, title)),
                    React.createElement(FormText, { className: FormTextClasses.description },
                        React.createElement(Markdown, null, description))),
                React.createElement(Button, { color: Button.Colors.BRAND, disabled: false, onClick: callback }, buttonText))));
    };

    var Switch = ({ title, description, setName, disabled = false, onChange }) => {
        const React = exports.patchcordAPI.common.React;
        const { SwitchItem, Markdown } = getElements();
        const [value, setValue] = React.useState(localStorage.getItem(`PATCHCORD_${setName}`) === 'true');
        const callback = (v) => {
            localStorage.setItem(`PATCHCORD_${setName}`, v);
            setValue(v);
            onChange?.(v);
        };
        return (React.createElement(SwitchItem, { note: React.createElement(Markdown, null, description), value: value, disabled: disabled, onChange: (v) => callback(v) }, title));
    };

    var MainUI = () => {
        const React = exports.patchcordAPI.common.React;
        return (React.createElement(React.Fragment, null,
            React.createElement(Switch, { title: "Cumcord", description: "Load Cumcord in Patchcord.", setName: "cumcord", onChange: async (v) => {
                    if (v)
                        unsafeWindow.eval(await (await fetch('https://raw.githubusercontent.com/Cumcord/builds/main/build.js')).text());
                    else
                        unsafeWindow.cumcord.uninject();
                } }),
            React.createElement(ItemWithButton, { title: "my balls", description: "are on fire", buttonText: "wtf", callback: () => console.log('cock') })));
    };

    function findAsync(filter, legacycompat = true) {
        let foundModule = filter();
        if (foundModule !== undefined) {
            foundModule = Promise.resolve(foundModule);
            if (legacycompat) {
                return foundModule;
            }
            return [foundModule, () => { }];
        }
        const patches = [];
        function unpatchAll() {
            for (const unpatch of patches)
                unpatch();
        }
        const modulePromise = new Promise((resolve) => {
            patches.push(exports.patchcordAPI.spitroast.before('push', window.webpackChunkdiscord_app, ([[, modules]]) => {
                for (const moduleId in modules) {
                    patches.push(exports.patchcordAPI.spitroast.after(moduleId, modules, () => {
                        if (foundModule !== undefined)
                            return;
                        foundModule = filter();
                        if (foundModule !== undefined) {
                            unpatchAll();
                            resolve(foundModule);
                        }
                    }, true));
                }
            }));
        });
        return legacycompat ? modulePromise : [modulePromise, unpatchAll];
    }
    function findAndPatch(moduleFinder, patchCallback) {
        let cancelled = false;
        let unpatch;
        const [modPromise, webpackUnpatch] = findAsync(moduleFinder, false);
        modPromise.then((mod) => {
            if (!cancelled)
                unpatch = patchCallback(mod);
        });
        return () => {
            cancelled = true;
            webpackUnpatch?.();
            unpatch?.();
        };
    }

    const sections = [];
    function registerSection(id, name, component) {
        const section = { section: id, label: name, element: component };
        sections.push(section);
        return () => {
            const i = sections.indexOf(section);
            if (i !== -1)
                sections.splice(i, 1);
        };
    }
    function initUserSettings() {
        findAndPatch(() => exports.patchcordAPI.webpack.findByDisplayName('SettingsView'), (SettingsView) => exports.patchcordAPI.spitroast.after('getPredicateSections', SettingsView.prototype, (_a, sects) => {
            const pos = sects.findIndex((e) => e.section === 'changelog') - 1;
            // if we're not in user settings, die
            if (pos < 0)
                return;
            sects.splice(pos, 0, { section: 'DIVIDER' }, { section: 'HEADER', label: 'Patchcord' }, ...sections);
            return sects;
        }));
    }

    async function loadLibs() {
        // @ts-ignore
        const websmack = await import('https://esm.sh/@cumjar/websmack');
        const webpack = websmack.createApi(websmack.autoraid());
        // @ts-ignore
        const spitroast = await import('https://esm.sh/spitroast');
        return [webpack, spitroast];
    }
    exports.patchcordAPI = void 0;
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
        exports.patchcordAPI = ipatchcordAPI;
        unsafeWindow.patchcordAPI = ipatchcordAPI;
        registerSection('modstoggler', 'Client Mods', MainUI);
        initUserSettings();
    })();

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=bundle.user.js.map
