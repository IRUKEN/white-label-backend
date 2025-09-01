import { extendType, stringArg, nonNull } from 'nexus';

import type { GraphQLContext } from '../../../graphql/context';
import { UserType } from '../models/user.model';

export const UserQueries = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('users', {
      type: UserType,
      resolve: (_root, _args, context: GraphQLContext) => {
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
      resolve: (_root, args, context: GraphQLContext) => {
        return context.prisma.user.create({
          data: {
            email: args.email,
            name: args.name ?? undefined,
          },
        });
      },
    });
  },
});
