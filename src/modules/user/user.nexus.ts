// src/modules/user.ts
import { objectType, extendType, stringArg, nonNull } from 'nexus';
import { User } from 'nexus-prisma';

import type { GraphQLContext } from '../../graphql/context';

export const UserType = objectType({
  name: User.$name,
  definition(t) {
    t.field(User.id);
    t.field(User.email);
    t.field(User.name);
    t.field(User.createdAt);
  },
});

export const UserQueries = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('users', {
      type: UserType,
      resolve: (_root, _arguments, context: GraphQLContext) => {
        return context.prisma.user.findMany();
      },
    });
  },
});

export const UserMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createUser', {
      type: UserType,
      args: {
        email: nonNull(stringArg()),
        name: stringArg(),
      },
      resolve: (
        _root,
        arguments_: { email: string; name?: string | null },
        context: GraphQLContext,
      ) => {
        return context.prisma.user.create({
          data: {
            email: arguments_.email,
            name: arguments_.name ?? undefined,
          },
        });
      },
    });
  },
});
