import { rmSync } from 'node:fs';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { builtinModules } from 'module';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import pkg from './package.json';

const port = process.env.port || process.env.npm_config_port || 8081; // 端口
// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
	//同步删除给定路径上的文件
	rmSync('dist-electron', { recursive: true, force: true });
	const isServe = command === 'serve';
	const isBuild = command === 'build';
	const sourcemap = isServe || !!process.env.VSCODE_DEBUG;
	return {
		//base:'',//有点重要，新项目打包时没留意项目设置的是绝对路径，导致项目打包后白屏在这里浪费了很长时间。
		resolve: {
			alias: [
				{
					find: '@', //指向的是src目录
					replacement: resolve(__dirname, 'src'),
				},
			],
		},
		server: {
			host: 'localhost',
			port: port,
			// open: true, //先注释，不然启动不起来怪尴尬的
			strictPort: false,
			https: false,
			// proxy: {//跨域设置

			// },
		},
		plugins: [
			vue(),
			electron([
				{
					// Main-Process entry file of the Electron App.
					entry: 'electron/main.cjs',
					onstart(options) {
						if (process.env.VSCODE_DEBUG) {
							console.log(
								/* For `.vscode/.debug.script.mjs` */ '[startup] Electron App'
							);
						} else {
							options.startup();
						}
					},
					vite: {
						build: {
							sourcemap,
							minify: isBuild,
							outDir: 'dist-electron/main',
							rollupOptions: {
								external: Object.keys(
									'dependencies' in pkg ? pkg.dependencies : {}
								),
							},
						},
					},
				},
				{
					entry: 'electron/preload.cjs',
					onstart(options) {
						// Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
						// instead of restarting the entire Electron App.
						options.reload();
					},
					vite: {
						build: {
							sourcemap: sourcemap ? 'inline' : undefined, // #332
							minify: isBuild,
							outDir: 'dist-electron/preload',
							rollupOptions: {
								external: Object.keys(
									'dependencies' in pkg ? pkg.dependencies : {}
								),
							},
						},
					},
				},
			]),
			// Use Node.js API in the Renderer-process
			renderer(),
		],
		build: {
			assetsDir: 'static', // 静态资源的存放目录
			assetsPublicPath: './',
			assetsInlineLimit: 4096, // 图片转 base64 编码的阈值
			chunkSizeWarningLimit: 1000,
			rollupOptions: {
				external: [
					// 告诉 Rollup 不要打包内建 API
					'electron',
					...builtinModules,
				],
			},
			optimizeDeps: {
				exclude: ['electron'], // 告诉 Vite 排除预构建 electron，不然会出现 __diranme is not defined
			},
		},
		clearScreen: false,
	};
});
