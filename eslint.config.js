import eslint from "@eslint/js";
import tsparser from "@typescript-eslint/parser";
import esimport from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import unusedImports from "eslint-plugin-unused-imports";
import vitest from "eslint-plugin-vitest";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		ignores: [
			"**/.env",
			"**/.DS_Store",
			"**/.gitignore",
			"**/.prettierignore",
			"**/.vscode/*",
			"**/node_modules/*",
			"**/dist/*",
			"**/docs/*",
			"**/doc/*",
			"**/bundle/*",
			"**/coverage/*",
			"**/flamegraph.*",
			"**/tsconfig.tsbuildinfo",
			"**/benchmark-output.txt",
			"**/*.log",
			"**/*_pb.js",
			"**/*_pb.ts",
			"**/serializer.ts",
		],
	},
	eslint.configs.recommended,
	tseslint.configs.strict,
	{
		plugins: {
			"@typescript-eslint": tseslint.plugin,
			"import": esimport,
			"prettier": prettier,
			"unused-imports": unusedImports,
			"vitest": vitest,
		},
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaVersion: 2021,
				sourceType: "module",
				project: "./tsconfig.json",
			},
			globals: {
				...globals.node,
				...globals.es2021,
			},
		},
		rules: {
			"prettier/prettier": "error",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					varsIgnorePattern: "_",
					argsIgnorePattern: "_",
					caughtErrors: "all",
					caughtErrorsIgnorePattern: "_",
				},
			],
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-dynamic-delete": "off",
			"@typescript-eslint/no-inferrable-types": "off",
			"@typescript-eslint/no-floating-promises": "error",
			"no-unused-vars": "off",
			"unused-imports/no-unused-imports": "error",
			"prefer-const": "error",
			"import/order": [
				"error",
				{
					"groups": [["builtin", "external", "internal"]],
					"newlines-between": "always",
					"alphabetize": {
						order: "asc",
						caseInsensitive: true,
					},
				},
			],
		},
	}
);
