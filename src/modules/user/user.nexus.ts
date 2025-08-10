import { objectType, extendType, nonNull, stringArg } from 'nexus';

import type { GraphQLContext } from '../../graphql/context';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('email');
    t.string('name');
    t.nonNull.string('createdAt');
    t.nonNull.string('updatedAt');
  },
});

export const UserQueries = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('users', {
      type: User,
      resolve: (_r, _a, context: GraphQLContext) =>
        context.prisma.user.findMany(),
    });
  },
});

export const UserMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createUser', {
      type: User,
      args: { email: nonNull(stringArg()), name: stringArg() },
      resolve: (
        _r,
        a: { email: string; name?: string | null },
        context: GraphQLContext,
      ) =>
        context.prisma.user.create({
          data: { email: a.email, name: a.name ?? undefined },
        }),
    });
  },
});
