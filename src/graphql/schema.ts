import * as path from 'node:path';

import { makeSchema } from 'nexus';

import { UserType, UserQueries, UserMutations } from '../modules/user'; // importa todo explícitamente

import { DateTime } from './scalars/date-time.scalar';

export const nexusSchema = makeSchema({
  types: [DateTime, UserType, UserQueries, UserMutations],
  outputs: {
    schema: path.join(process.cwd(), 'src/graphql/schema.graphql'),
    typegen: path.join(
      process.cwd(),
      'node_modules/@types/nexus-typegen/index.d.ts',
    ),
  },
  contextType: {
    module: path.join(process.cwd(), 'src/graphql/context.ts'),
    export: 'GraphQLContext',
  },
});
