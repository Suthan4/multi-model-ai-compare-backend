import { buildSchema } from "graphql";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

export const schema = buildSchema(typeDefs);
export { resolvers };
