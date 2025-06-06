import antfu from "@antfu/eslint-config";

import withNuxt from "./.nuxt/eslint.config.mjs";

// TODO: add tailwindcss plugin

export default withNuxt(
  antfu(
    {
      type: "app",
      vue: true,
      typescript: true,
      formatters: true,
      stylistic: {
        indent: 2,
        semi: true,
        quotes: "double",
      },
      ignores: ["**/migrations/**"],
    },
    {
      rules: {
        "vue/max-attributes-per-line": ["error", {
          singleline: {
            max: 3,
          },
          multiline: {
            max: 1,
          },
        }],
        "ts/no-redeclare": "off",
        "ts/consistent-type-definitions": ["error", "type"],
        "no-console": ["off"],
        "antfu/no-top-level-await": ["off"],
        "node/prefer-global/process": ["off"],
        "node/no-process-env": ["error"],
        "perfectionist/sort-imports": [
          "error",
          {
            tsconfigRootDir: ".",
          },
        ],
        "unicorn/filename-case": [
          "error",
          {
            case: "kebabCase",
            ignore: ["README.md"],
          },
        ],
        "vue/html-self-closing": ["error", {
          html: {
            void: "always", // e.g. <br> instead of <br />
            normal: "never", // e.g. <div></div> instead of <div />
            component: "always", // e.g. <MyComponent />
          },
          svg: "always",
          math: "always",
        }],
        "no-unused-vars": "off",
        "unused-imports/no-unused-vars": "warn",
      },
    },
  ),
  // Your custom configs here
);
