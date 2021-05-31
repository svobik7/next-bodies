import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-ts'
import pkg from './package.json'

// external dependencies will not be included in bundle
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

export default [
  {
    input: ['src/index.tsx'],
    output: {
      dir: 'dist',
      format: 'cjs',
      exports: 'named',
    },
    // preserveModules: true,
    plugins: [
      typescript({
        typescript: require('typescript'),
      }),
      terser({ format: { comments: false } }), // minifies generated bundles
    ],
    external: external,
  },
]
