import { ConfigEnv, UserConfig, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'
const pathSrc = path.resolve(__dirname, 'src')

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


// https://vitejs.dev/config/
export default defineConfig( ( {mode} : ConfigEnv): UserConfig => {
    return {
        base: '/coralscop/',
        resolve: {
            alias: {
                "@": pathSrc,
            },
        },
        plugins: [
            vue(),
            AutoImport({
                imports: ['vue'],
                eslintrc: {
                    enabled: true,
                    filepath: "./.eslintrc-auto-import.json",
                },
                dts: path.resolve(pathSrc, 'types', 'auto-imprts.d.ts'),
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                dts: path.resolve(pathSrc, 'types', 'components.d.ts'),
                resolvers: [ElementPlusResolver()],
            })
        ],
        server: {
            proxy: {
                '/api': {
                    target: 'https://coralscop-test.hkustvgd.com',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '')
                },
                '/bke': {
                    target: 'https://coralscop-bke.hkustvgd.com/api/v1/',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/bke/, '')
                }
            }
        }
    }
  
})
