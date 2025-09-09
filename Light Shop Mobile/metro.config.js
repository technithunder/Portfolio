const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    alias: {
      // Fix for reanimated-color-picker
      'react-native-reanimated/lib/reanimated2/core': 'react-native-reanimated/src/reanimated2/core',
      'react-native-reanimated/lib/reanimated2/Colors': 'react-native-reanimated/src/reanimated2/Colors',
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);