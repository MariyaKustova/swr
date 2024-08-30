const CracoAlias = require("craco-alias");
const path = require("path");

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        baseUrl: ".",
        tsConfigPath: "tsconfig.json",
      },
    },
  ],
  webpack: {
    alias: {
      "@api": path.resolve(__dirname, "./src/api"),
      "@core": path.resolve(__dirname, "./src/core"),
      "@model": path.resolve(__dirname, "./src/model"),
      "@constants": path.resolve(__dirname, "./src/constants"),
    },
  },
};
