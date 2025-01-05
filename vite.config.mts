import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		exclude: ["**/node_modules"],
		coverage: {
			enabled: true,
			reporter: ["text", "lcov"],
			include: ["packages/**/*.{ts,tsx}"],
			exclude: ["**/node_modules/**", "**/__tests__/**", "**/tests/**", "**/*_pb.d.ts", "**/*_pb.ts"],
		},
	},
});
