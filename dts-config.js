// @ts-check

// If won't use `@ts-check` - just remove that comments (with `@type` JSDoc below).

const commonOutputParams = {
  inlineDeclareGlobals: false,
  sortNodes: true,
};
const createEntry = (folder) => {
  return {
    filePath: `./src/${folder}/entry.ts`,
    outFile: `dest/${folder}/index.d.ts`,
    noCheck: true,
    output: commonOutputParams,
  };
};

const config = {
  compilationOptions: {
    preferredConfigPath: "./tsconfig.json",
  },
  entries: [
    // createEntry("GridTable"),
    // createEntry("ApiAuthorization"),
    // createEntry("SubComponents"),
    // createEntry("helper"),
    createEntry("Views"),
  ],
};
// eslint-disable-next-line no-undef
module.exports = config;
