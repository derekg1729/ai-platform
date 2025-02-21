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

// Ignore configuration
const ignoresConfig = {
  ignores: [
    // Build outputs
    "**/dist/**/*",
    "**/build/**/*",
    "**/.next/**/*",
    "**/out/**/*",
    "**/webpack.js",
    "**/webpack-runtime.js",
    
    // Coverage reports
    "**/coverage/**/*",
    "**/lcov-report/**/*",
    
    // Dependencies
    "**/node_modules/**/*",
    "**/.pnp/**/*",
    "**/.pnp.js",
    
    // Environment and config files
    "**/.env*",
    "**/.eslintrc.js",
    "**/next-env.d.ts",
    "**/*.config.js",
    "**/*.config.mjs",
    
    // Misc
    "**/.DS_Store",
    "**/*.pem",
    "**/npm-debug.log*",
    "**/yarn-debug.log*",
    "**/yarn-error.log*",
    "**/.vercel/**/*"
  ]
};

// Base configuration for all files
const baseConfig = {
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
  rules: {
    // Base ESLint rules
    "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    "no-unused-vars": "off", // Handled by TypeScript
  },
};

// TypeScript-specific configuration
const typeScriptConfig = {
  files: ["src/**/*.ts", "src/**/*.tsx", "scripts/**/*.ts"],
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
    // TypeScript rules - Matching Vercel's requirements
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": ["warn", {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
    }],

    // Next.js rules - Keep these as warnings
    "@next/next/no-html-link-for-pages": "warn",
    "@next/next/no-img-element": "warn",
    "@next/next/no-head-element": "warn",
    "@next/next/no-page-custom-font": "warn",
    "@next/next/no-sync-scripts": "warn",
    "@next/next/no-title-in-document-head": "warn",
    "@next/next/no-assign-module-variable": "off",
  },
};

// Test-specific configuration
const testConfig = {
  files: ["src/**/*.test.ts", "src/**/*.test.tsx", "src/__tests__/**/*"],
  rules: {
    // Relax rules for tests
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "no-console": "off",
  },
};

const eslintConfig = [
  ignoresConfig,
  baseConfig,
  typeScriptConfig,
  testConfig,
  ...compat.extends("next/core-web-vitals"),
];

export default eslintConfig;
