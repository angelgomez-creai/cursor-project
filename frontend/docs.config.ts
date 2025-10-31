/**
 * Configuration file for documentation generation
 */
import { TypeDocOptions } from 'typedoc'

export const docsConfig: Partial<TypeDocOptions> = {
  entryPoints: ['src/index.ts', 'src/features/**/index.ts', 'src/shared/**/index.ts'],
  out: 'docs',
  plugin: ['typedoc-plugin-markdown'],
  readme: './README.md',
  name: 'E-commerce Frontend API Documentation',
  includeVersion: true,
  excludePrivate: false,
  excludeProtected: false,
  excludeInternal: false,
}

