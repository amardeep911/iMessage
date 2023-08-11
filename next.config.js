const withTM = require('next-transpile-modules')(['ui']);

module.exports = withTM({
  reactStrictMode: true,
  webpack: config => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
});
