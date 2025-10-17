import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

const ignorePatterns = [
  "dist",
  "coverage",
  "node_modules",
  "apps/**/dist",
  "apps/**/node_modules",
];

const baseExtends = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
];

const prettierRules = {
  ...prettierPlugin.configs.recommended.rules,
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^ignored",
    },
  ],
};

const buildConfig = ({ files, globalsConfig, extraExtends = [] }) => ({
  files,
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    globals: globalsConfig,
  },
  plugins: {
    prettier: prettierPlugin,
  },
  extends: [...baseExtends, ...extraExtends],
  rules: prettierRules,
});

export const createProjectConfig = (project) => {
  const isFrontend = project === "frontend";

  return defineConfig([
    globalIgnores(ignorePatterns),
    buildConfig({
      files: ["**/*.{ts,tsx}"],
      globalsConfig: isFrontend ? globals.browser : globals.node,
      extraExtends: isFrontend
        ? [reactHooks.configs["recommended-latest"], reactRefresh.configs.vite]
        : [],
    }),
  ]);
};

export const createWorkspaceConfig = () =>
  defineConfig([
    globalIgnores(ignorePatterns),
    buildConfig({
      files: ["apps/backend/**/*.{ts,tsx}"],
      globalsConfig: globals.node,
    }),
    buildConfig({
      files: ["apps/frontend/**/*.{ts,tsx}"],
      globalsConfig: globals.browser,
      extraExtends: [
        reactHooks.configs["recommended-latest"],
        reactRefresh.configs.vite,
      ],
    }),
  ]);

export default createWorkspaceConfig();
