import { build } from 'esbuild'

await build({
  entryPoints: ['server/vercel-sip-check.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: 'api/sip-check.js',
  target: 'node20',
  legalComments: 'none',
})
