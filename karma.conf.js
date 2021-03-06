const {createDefaultConfig} = require('@open-wc/testing-karma');
const merge = require('deepmerge');

module.exports = (config) => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [{pattern: './src/**/*.spec.ts', type: 'module'}],

      esm: {
        babel: true,
        nodeResolve: true,
        fileExtensions: ['.ts'],
        customBabelConfig: {
          plugins: [
            [
              '@babel/plugin-proposal-decorators',
              {
                decoratorsBeforeExport: true,
              },
            ],
            '@babel/plugin-proposal-class-properties',
          ],
          presets: ['@babel/preset-typescript'],
        },
      },
    }),
  );
  return config;
};
