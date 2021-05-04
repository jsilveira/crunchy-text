/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: '/',
    src: '/dist',
  },
  plugins: [
    '@snowpack/plugin-sass',
  ],
  buildOptions: {
    out: 'dist',
    metaUrlPath: 'snowpack'
  }
};
