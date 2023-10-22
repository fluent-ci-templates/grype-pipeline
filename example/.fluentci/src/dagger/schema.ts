import {
  queryType,
  makeSchema,
  dirname,
  join,
  resolve,
  stringArg,
  nonNull,
} from "../../deps.ts";

import { scan } from "./jobs.ts";

const Query = queryType({
  definition(t) {
    t.string("scan", {
      args: {
        src: nonNull(stringArg()),
        image: nonNull(stringArg()),
        failOn: nonNull(stringArg()),
      },
      resolve: async (_root, args, _ctx) =>
        await scan(args.src, args.image, args.failOn),
    });
  },
});

export const schema = makeSchema({
  types: [Query],
  outputs: {
    schema: resolve(join(dirname(".."), dirname(".."), "schema.graphql")),
    typegen: resolve(join(dirname(".."), dirname(".."), "gen", "nexus.ts")),
  },
});
