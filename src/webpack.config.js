const path = require("path");

module.exports = {
  resolve: {
    fallback: {
      https: require.resolve("https-browserify"),
      stream: require.resolve("stream-browserify"),
      assert: require.resolve("assert/"),
    },
  },
};
