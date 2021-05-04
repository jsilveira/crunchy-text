/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: '/',
    src: '/docs',
  },
  plugins: [
    '@snowpack/plugin-sass',
  ],
  buildOptions: {
    out: 'docs',
    metaUrlPath: 'snowpack'
  },
  optimize: {
    bundle: true,
    minify: true
  }
};
