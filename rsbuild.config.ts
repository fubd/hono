import {defineConfig} from '@rsbuild/core';
import {pluginReact} from '@rsbuild/plugin-react';

export default defineConfig({
  server: {
    base: '/static',
  },
  source: {
    entry: {
      index: './client/main.tsx',
    },
  },
  output: {
    filename: {
      html: '[name].html',
      js: '[contenthash].bundle.js',
      css: '[name].[contenthash:8].css',
    },
    distPath: {
      root: './gateway/static',
      html: './',
      favicon: './',
      css: './',
      js: './',
    },
    cleanDistPath: true,
    sourceMap: false,
    legalComments: 'none',
  },
  plugins: [pluginReact()],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  html: {
    template: './template.html',
  },
});
