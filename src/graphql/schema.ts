// src/graphql/schema.ts
import { join } from 'node:path';

import { makeSchema } from 'nexus';

import * as Domains from '../modules'; // Import all modules
export const nexusSchema = makeSchema({
  // Nexus admite colecciones anidadas; puedes pasar el objeto Domains entero
  types: [Domains],
  outputs: {
    schema: join(process.cwd(), 'graphql.schema.graphql'),
    typegen: join(
      process.cwd(),
      'node_modules/@types/nexus-typegen/index.d.ts',
    ),
  },
  contextType: {
    module: join(process.cwd(), 'src/graphql/context.ts'),
    export: 'GraphQLContext',
  },
});
