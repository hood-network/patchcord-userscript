import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescriptPlugin from '@rollup/plugin-typescript';
import typescript from 'typescript';
import metablock from 'rollup-plugin-userscript-metablock';

const fs = require('fs');
const pkg = require('./package.json');

fs.mkdir('dist/', { recursive: true }, () => null);

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.user.js',
    format: 'iife',
    name: 'rollupUserScript',
    sourcemap: true,
  },
  external: ['https://esm.sh/@cumjar/websmack', 'https://esm.sh/spitroast'],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      ENVIRONMENT: JSON.stringify('production'),
      preventAssignment: true,
    }),
    nodeResolve({ extensions: ['.js', '.ts', '.tsx'] }),
    typescriptPlugin({ typescript }),
    commonjs({
      include: ['node_modules/**'],
      exclude: ['node_modules/process-es6/**'],
    }),
    babel({ babelHelpers: 'bundled' }),
    metablock({
      file: './meta.json',
    }),
  ],
};
