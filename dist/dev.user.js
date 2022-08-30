// ==UserScript==
// @name        rollup-userscript-template [dev]
// @description Bundle typescript, react and JSX/TSX script files into a single userscript file with rollup
// @namespace   npmjs.com/rollup-plugin-userscript-metablock
// @author      cuzi
// @run-at      document-start
// @include     https://patchcord.pw/*
// @match       https://patchcord.pw/*
// @version     1.2.3
// @homepage    https://github.com/cvzi/rollup-userscript-template
// @license     MIT
// @grant       unsafeWindow
// @grant       GM.xmlHttpRequest
// @grant       GM.setValue
// @grant       GM.getValue
// ==/UserScript==
/*  globals GM */

'use strict';

(function () {
  const url = `http://localhost:8124/bundle.user.js?${Date.now()}`
  new Promise(function loadBundleFromServer (resolve, reject) {
    const req = GM.xmlHttpRequest({
      method: 'GET',
      url: url,
      onload: function (r) {
        if (r.status !== 200) {
          return reject(r)
        }
        resolve(r.responseText)
      },
      onerror: e => reject(e)
    })
    if (req && 'catch' in req) {
      req.catch(e => { /* ignore */ })
    }
  }).catch(function (e) {
    const log = function (obj, b) {
      let prefix = 'loadBundleFromServer: '
      try {
        prefix = GM.info.script.name + ': '
      } catch (e) {}
      if (b) {
        console.log(prefix + obj, b)
      } else {
        console.log(prefix, obj)
      }
    }
    if (e && 'status' in e) {
      if (e.status <= 0) {
        log('Server is not responding')
        GM.getValue('scriptlastsource3948218', false).then(function (src) {
          if (src) {
            log('%cExecuting cached script version', 'color: Crimson; font-size:x-large;')
            /* eslint-disable no-eval */
            eval(src)
          }
        })
      } else {
        log('HTTP status: ' + e.status)
      }
    } else {
      log(e)
    }
  }).then(function (s) {
    if (s) {
      /* eslint-disable no-eval */
      eval(`${s}
//# sourceURL=${url}`)
      GM.setValue('scriptlastsource3948218', s)
    }
  })
})()