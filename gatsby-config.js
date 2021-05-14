const fs = require("fs");
const pluralize = require("pluralize");
const workingGroups = JSON.parse(
  fs.readFileSync(require.resolve("./src/data/working-groups.json"))
);

module.exports = {
  siteMetadata: {
    title: "EI2030",
  },
  pathPrefix: "/EI2030",
  plugins: [
    "gatsby-plugin-theme-ui",
    "gatsby-transformer-remark",
    {
      resolve: "gatsby-transformer-json",
      options: {
        typeName: ({ node }) =>
          node.name
            .split("-")
            .map((w) => pluralize.singular(w.toLowerCase()))
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(""),
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: "./src/data/",
      },
    },
    ...workingGroups.map((gitOptions) => ({
      resolve: "gatsby-source-git",
      options: {
        branch: "main",
        patterns: "website/**",
        ...gitOptions,
      },
    })),
  ],
};
