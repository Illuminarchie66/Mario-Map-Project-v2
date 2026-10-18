import { defineConfig } from "vite";
import { resolve } from 'path';

export default defineConfig({
    base: "./",
    build: {
        rollupOptions: {
            input: {
                main: resolve(import.meta.dirname, 'index.html'),
                mariodle: resolve(import.meta.dirname, 'mariodle/index.html'),
            }
        }
    }
});