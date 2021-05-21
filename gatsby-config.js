const fs = require("fs");
const path = require("path");
const pluralize = require("pluralize");
const workingGroups = JSON.parse(
  fs.readFileSync(require.resolve("./src/data/working-groups.json"))
);

// This is used by our Git Actions CI/CD process to create deployments dynamically for pull requests
const pathPrefix = path.join("/EI2030", process.env.PATH_PREFIX_VALUE);
console.log("gatsby-config.js pathPrefix will be set to:", pathPrefix);

module.exports = {
  siteMetadata: {
    title: "EI2030",
  },
  pathPrefix,
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
