import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import typescriptParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import nextPlugin from "@next/eslint-plugin-next";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

// Base configuration for all files
const baseConfig = {
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
  ignores: ["**/.next/**"],
  rules: {
    // Base ESLint rules
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-unused-vars": "off", // Handled by TypeScript
  },
};

// TypeScript-specific configuration
const typeScriptConfig = {
  files: ["**/*.ts", "**/*.tsx"],
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      project: "./tsconfig.json",
      ecmaVersion: 2022,
      sourceType: "module",
    },
  },
  plugins: {
    "@typescript-eslint": typescriptPlugin,
    "@next": nextPlugin,
  },
  rules: {
    // TypeScript rules
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
    }],
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    "@typescript-eslint/strict-boolean-expressions": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",

    // Next.js rules
    "@next/next/no-html-link-for-pages": "error",
    "@next/next/no-img-element": "error",
    "@next/next/no-head-element": "error",
    "@next/next/no-page-custom-font": "error",
    "@next/next/no-sync-scripts": "error",
    "@next/next/no-title-in-document-head": "error",
  },
};

// Test-specific configuration for regular tests
const testConfig = {
  files: ["**/*.test.ts", "**/*.test.tsx", "**/__tests__/**/*"],
  rules: {
    // Relax certain rules for tests
    "@typescript-eslint/no-explicit-any": ["off", { "ignoreRestArgs": true }],
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-return": "off",
  },
};

// Strict configuration for lint check test
const lintCheckConfig = {
  files: ["**/lint-check.test.ts"],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    "@typescript-eslint/strict-boolean-expressions": "error",
  },
};

export default [
  baseConfig,
  typeScriptConfig,
  testConfig,
  lintCheckConfig,
  ...compat.extends("next/core-web-vitals"),
];
