// src/modules/user/models/user.model.ts
import { objectType } from 'nexus';
import { User } from 'nexus-prisma';

export const UserType = objectType({
  name: User.$name,
  description: 'GraphQL type for User entity',
  definition(t) {
    t.field(User.id);
    t.field(User.email);
    t.field(User.name);
    t.field(User.createdAt);
  },
});
