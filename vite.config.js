import { defineConfig } from 'vite';
import path from 'path';
import fs from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));

function copyReadmePlugin() {
    return {
        name: 'copy-readme',
        closeBundle() {
            const source = path.resolve(__dirname, 'README.md');
            const destination = path.resolve(__dirname, 'dist/README.md');

            if (fs.existsSync(source)) {
                fs.copyFileSync(source, destination);
            }
        }
    };
}

export default defineConfig({
    plugins: [
        dts({
            include: ['src/index.ts'],
            beforeWriteFile(filePath, content) {
                if (filePath.endsWith('index.d.ts')) {
                    return {
                        filePath: path.resolve(
                            path.dirname(filePath),
                            'svg-path-gradient.d.ts'
                        ),
                        content
                    };
                }
                return { filePath, content };
            }
        }),
        copyReadmePlugin()
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'SvgPathGradient',
            fileName: 'svg-path-gradient',
        },
        rollupOptions: {
            external: [],
            output: {
                globals: {}
            }
        },
        outDir: 'dist',
        emptyOutDir: true,
    },
});
