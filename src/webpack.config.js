// webpack.config.js
const path = require("path");

module.exports = {
  // 기타 설정...
  resolve: {
    fallback: {
      https: require.resolve("https-browserify"),
      stream: require.resolve("stream-browserify"),
      assert: require.resolve("assert/"),
    },
  },
};
