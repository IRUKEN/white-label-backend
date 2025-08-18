import { scalarType } from 'nexus';
import { Kind } from 'graphql';

export const DateTime = scalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar for ISO timestamps',
  asNexusMethod: 'dateTime', // opcional: permite usar t.dateTime()
  parseValue(value: string | number | Date): Date {
    return new Date(value); // de entrada a Date
  },
  serialize(value: string | number | Date): string {
    return new Date(value).toISOString(); // de salida a string
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return undefined;
  },
});
